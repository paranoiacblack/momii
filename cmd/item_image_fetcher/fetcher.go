package main

import (
	"errors"
	"flag"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/yuin/gopher-lua/ast"
	"github.com/yuin/gopher-lua/parse"
)

var (
	itemInfo = flag.String("itemInfoFile", "static/iteminfo.lua", "Path to 'iteminfo.lua' containing item information")
	imageDir = flag.String("imageDir", "static/images", "Path to save fetched images")
)

const (
	smallImageURLPrefix = "https://www.divine-pride.net/img/items/item/iRO/"
	largeImageURLPrefix = "https://www.divine-pride.net/img/items/collection/iRO/"
)

func main() {
	flag.Parse()

	if *itemInfo == "" || *imageDir == "" {
		log.Fatal("Must provide --itemInfoFile and --imageDir")
	}

	ids, err := parseItemIDs(*itemInfo)
	if err != nil {
		log.Fatal(err)
	}

	if err := downloadROImages(ids, *imageDir); err != nil {
		log.Fatal(err)
	}
}

func parseItemIDs(infoPath string) ([]string, error) {
	file, err := os.Open(infoPath)
	if err != nil {
		return nil, err
	}

	chunks, err := parse.Parse(file, "tbl")
	if err != nil {
		return nil, err
	}

	assignStmt, ok := chunks[0].(*ast.AssignStmt)
	if !ok {
		return nil, errors.New("expected assignment statement tbl = {}")
	}

	tableExpr, ok := assignStmt.Rhs[0].(*ast.TableExpr)
	if !ok {
		return nil, errors.New("expected RHS of assignment to be a table expression")
	}

	ids := []string{}
	for _, field := range tableExpr.Fields {
		// Skip error checking logic here since the table key must be a numeric expression here.
		numExpr := field.Key.(*ast.NumberExpr)
		ids = append(ids, numExpr.Value)
	}
	return ids, nil
}

func downloadROImages(ids []string, imageDir string) error {
	if err := os.MkdirAll(filepath.Join(imageDir, "small"), 0750); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Join(imageDir, "large"), 0750); err != nil {
		return err
	}

	for _, id := range ids {
		if err := saveROImage(smallImageURLPrefix+id, filepath.Join(imageDir, "small", id+".png")); err != nil {
			return err
		}

		if err := saveROImage(largeImageURLPrefix+id, filepath.Join(imageDir, "large", id+".png")); err != nil {
			return err
		}
	}
	return nil
}

func saveROImage(imageURL, path string) error {
	resp, err := http.Get(imageURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	img, err := os.Create(path)
	if err != nil {
		return err
	}

	if _, err := io.Copy(img, resp.Body); err != nil {
		return err
	}
	return nil
}

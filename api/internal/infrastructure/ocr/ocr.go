package ocr

import (
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type OCRResult struct {
	FullText     string
	Ingredients  string
	Instructions string
}

type Word struct {
	Text string
	X    int
	Y    int
}

func ProcessImage(imagePath string, dividerX int) (*OCRResult, error) {
	cmd := exec.Command("tesseract", imagePath, "stdout", "tsv")
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	words := parseTSV(string(output))
	result := splitByDivider(words, dividerX)

	return result, nil
}

func parseTSV(tsv string) []Word {
	lines := strings.Split(tsv, "\n")
	var words []Word

	for _, line := range lines {
		fields := strings.Fields(line)
		if len(fields) < 12 {
			continue
		}

		x, err := strconv.Atoi(fields[6])
		if err != nil {
			continue
		}
		y, err := strconv.Atoi(fields[7])
		if err != nil {
			continue
		}

		text := fields[11]
		if text != "" {
			words = append(words, Word{Text: text, X: x, Y: y})
		}
	}

	return words
}

func splitByDivider(words []Word, dividerX int) *OCRResult {
	if len(words) == 0 {
		return &OCRResult{FullText: ""}
	}

	if dividerX <= 0 || dividerX >= 100 {
		dividerX = 50
	}

	var minX, maxX int
	for _, w := range words {
		if w.X < minX || minX == 0 {
			minX = w.X
		}
		if w.X > maxX {
			maxX = w.X
		}
	}

	imageWidth := maxX - minX
	if imageWidth == 0 {
		imageWidth = 1
	}

	dividerPosition := minX + (imageWidth * dividerX / 100)

	var leftWords, rightWords []Word
	for _, w := range words {
		if w.X < dividerPosition {
			leftWords = append(leftWords, w)
		} else {
			rightWords = append(rightWords, w)
		}
	}

	result := &OCRResult{
		FullText:     joinWords(words),
		Ingredients:  joinWords(leftWords),
		Instructions: joinWords(rightWords),
	}

	if result.Ingredients == "" && result.Instructions == "" {
		result.Ingredients = result.FullText
	}

	return result
}

func joinWords(words []Word) string {
	if len(words) == 0 {
		return ""
	}

	var texts []string
	for _, w := range words {
		texts = append(texts, w.Text)
	}
	return strings.Join(texts, "\n")
}

func SaveImage(src string, dst string) error {
	data, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	return os.WriteFile(dst, data, 0644)
}
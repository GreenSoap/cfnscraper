package backend

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
)

func ResetSaveData() {
	SaveMatchHistory(MatchHistory{
		CFN:          ``,
		LP:           0,
		LPGain:       0,
		Wins:         0,
		Losses:       0,
		TotalWins:    0,
		TotalLosses:  0,
		TotalMatches: 0,
		WinRate:      0,
		IsWin:        false,
	})
}

func SaveMatchHistory(matchHistory MatchHistory) {
	SaveTextToFile(`results`, `wins.txt`, strconv.Itoa(matchHistory.Wins))
	SaveTextToFile(`results`, `losses.txt`, strconv.Itoa(matchHistory.Losses))
	SaveTextToFile(`results`, `win-rate.txt`, strconv.Itoa(matchHistory.WinRate)+`%`)
	SaveTextToFile(`results`, `win-streak.txt`, strconv.Itoa(matchHistory.WinStreak))
	SaveTextToFile(`results`, `lp.txt`, strconv.Itoa(matchHistory.LP))
	gain := strconv.Itoa(matchHistory.LPGain)
	if matchHistory.LPGain > 0 {
		gain = `+` + gain
	}
	SaveTextToFile(`results`, `lp-gain.txt`, gain)

	// Do not save match result if there is no opponent
	if matchHistory.Opponent == `` {
		return
	}
	mhMarshalled, err := json.Marshal(&matchHistory)

	if err != nil {
		return
	}

	var arr []MatchHistory

	pastMatches, err := os.ReadFile(`results/` + matchHistory.CFN + `-log.json`)
	if err != nil {
		// No past matches
		str := "[" + string(mhMarshalled) + "]"
		SaveTextToFile(`results`, matchHistory.CFN+`-log.json`, str)
		return
	}

	err = json.Unmarshal(pastMatches, &arr)
	if err != nil {
		fmt.Println(`Could not unmarshal match history`, err)
		return
	}

	newArr := append(arr, matchHistory)
	newArrMarshalled, err := json.Marshal(&newArr)
	if err != nil {
		fmt.Println(`Error marshalling match history`)
		return
	}
	fmt.Println(string(newArrMarshalled))
	SaveTextToFile(`results`, matchHistory.CFN+`-log.json`, string(newArrMarshalled))
}

func SaveTextToFile(directory string, fileName string, text string) {
	var file *os.File
	var err error

	if directory != `` {
		err = os.Mkdir(`results`, os.FileMode(0755))
		file, err = os.Create(directory + `/` + fileName)
	} else {
		file, err = os.Create(fileName)
	}

	_, err = file.WriteString(text)
	defer file.Close()
	if err != nil {
		fmt.Println(`Issue writing to file`, fileName)
		LogError(SaveError)
	}
}
export const teamNameWithFlag = (teamName: string, rtl = false): string => {
  let flag = ""
  switch (teamName) {
    case "Qatar":
      flag = "🇶🇦"
      break
    case "Germany":
      flag = "🇩🇪"
      break
    case "Denmark":
      flag = "🇩🇰"
      break
    case "Brazil":
      flag = "🇧🇷"
      break
    case "France":
      flag = "🇫🇷"
      break
    case "Belgium":
      flag = "🇧🇪"
      break
    case "Serbia":
      flag = "🇷🇸"
      break
    case "Spain":
      flag = "🇪🇸"
      break
    case "Croatia":
      flag = "🇭🇷"
      break
    case "Switzerland":
      flag = "🇨🇭"
      break
    case "England":
      flag = "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
      break
    case "Netherlands":
      flag = "🇳🇱"
      break
    case "Argentina":
      flag = "🇦🇷"
      break
    case "Iran":
      flag = "🇮🇷"
      break
    case "South Korea":
      flag = "🇰🇷"
      break
    case "Saudi Arabia":
      flag = "🇸🇦"
      break
    case "Japan":
      flag = "🇯🇵"
      break
    case "Uruguay":
      flag = "🇺🇾"
      break
    case "Ecuador":
      flag = "🇪🇨"
      break
    case "Canada":
      flag = "🇨🇦"
      break
    case "Ghana":
      flag = "🇬🇭"
      break
    case "Senegal":
      flag = "🇸🇳"
      break
    case "Poland":
      flag = "🇵🇱"
      break
    case "Portugal":
      flag = "🇵🇹"
      break
    case "Tunisia":
      flag = "🇹🇳"
    case "Morocco":
      flag = "🇲🇦"
      break
    case "Cameroon":
      flag = "🇨🇲"
      break
    case "USA":
      flag = "🇺🇸"
      break
    case "Mexico":
      flag = "🇲🇽"
      break
    case "Wales":
      flag = "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
      break
    case "Australia":
      flag = "🇦🇺"
      break
    case "Costa Rica":
      flag = "🇨🇷"
      break
    default:
      break
  }
  return rtl ? `${flag} ${teamName}` : `${teamName} ${flag}`
}

export const teamNameWithFlag = (teamName: string, rtl = false): string => {
  let flag = ""
  switch (teamName) {
    case "Qatar":
      flag = "đśđŚ"
      break
    case "Germany":
      flag = "đŠđŞ"
      break
    case "Denmark":
      flag = "đŠđ°"
      break
    case "Brazil":
      flag = "đ§đˇ"
      break
    case "France":
      flag = "đŤđˇ"
      break
    case "Belgium":
      flag = "đ§đŞ"
      break
    case "Serbia":
      flag = "đˇđ¸"
      break
    case "Spain":
      flag = "đŞđ¸"
      break
    case "Croatia":
      flag = "đ­đˇ"
      break
    case "Switzerland":
      flag = "đ¨đ­"
      break
    case "England":
      flag = "đ´ó §ó ˘ó Ľó Žó §ó ż"
      break
    case "Netherlands":
      flag = "đłđą"
      break
    case "Argentina":
      flag = "đŚđˇ"
      break
    case "Iran":
      flag = "đŽđˇ"
      break
    case "South Korea":
      flag = "đ°đˇ"
      break
    case "Saudi Arabia":
      flag = "đ¸đŚ"
      break
    case "Japan":
      flag = "đŻđľ"
      break
    case "Uruguay":
      flag = "đşđž"
      break
    case "Ecuador":
      flag = "đŞđ¨"
      break
    case "Canada":
      flag = "đ¨đŚ"
      break
    case "Ghana":
      flag = "đŹđ­"
      break
    case "Senegal":
      flag = "đ¸đł"
      break
    case "Poland":
      flag = "đľđą"
      break
    case "Portugal":
      flag = "đľđš"
      break
    case "Tunisia":
      flag = "đšđł"
    case "Morocco":
      flag = "đ˛đŚ"
      break
    case "Cameroon":
      flag = "đ¨đ˛"
      break
    case "USA":
      flag = "đşđ¸"
      break
    case "Mexico":
      flag = "đ˛đ˝"
      break
    case "Wales":
      flag = "đ´ó §ó ˘ó ˇó Źó łó ż"
      break
    case "Australia":
      flag = "đŚđş"
      break
    case "Costa Rica":
      flag = "đ¨đˇ"
      break
    default:
      break
  }
  return rtl ? `${flag} ${teamName}` : `${teamName} ${flag}`
}

/*
MapleStory Bot
© 2021 Dark Tornado, All rights reserved.
*/

const Maple = {};
Maple.getCharInfo = (name) => {
    try {
        var data = org.jsoup.Jsoup.connect("https://maple.gg/u/" + name).get();
        var result = {};
        result.image = data.select("img.character-image").get(0).attr("src");
        result.rank = data.select("div[class=col-lg-2 col-md-4 col-sm-4 col-6 mt-3]").get(0).select("span").text();
        data = data.select("div.col-lg-8");
        result.name = data.select("b").get(0).text();
        result.server = data.select("img").attr("alt");
        data = data.select("li.user-summary-item");
        result.level = data.get(0).text();
        result.job = data.get(1).text();
        return result;
    } catch (e) {
        return null;
    }
}

response = (room, msg, sender, isGroupChat, replier, ImageDB, packageName) => {
    var cmd = msg.split(" ");
    if (cmd[0] == "/메") {
        var result = Maple.getCharInfo(cmd[1]);
        if (result == null) replier.reply("해당 캐릭터를 찾을 수 없습니다.");
        else replier.reply("이름 : " + result.name +
            "\n레벨 : " + result.level +
            "\n직업 : " + result.job +
            "\n월드 : " + result.server +
            "\n랭킹 : " + result.rank);
    }
}


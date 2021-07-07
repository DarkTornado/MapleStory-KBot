/*
MapleStory Bot
© 2021 Dark Tornado, All rights reserved.
*/

const Maple = {};
Maple.getCharInfo = (name) => {
    try {
        var data = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" + name)
            .get().select("tr.search_com_chk");
        var url = "https://maplestory.nexon.com" + data.select("a").attr("href");

        var result = {};
        result.img = data.select("span.char_img").select("img").get(0).attr("src");
        var imgs = data.select("img");
        result.icon = imgs.get(imgs.size() - 1).attr("src");

        data = data.select("td");
        result.exp = data.get(3).text();
        result.pri = data.get(4).text();
        result.guild = data.get(5).text();
        if (result.guild == "") result.guild = "(없음)";
        result.rank = data.get(0).select("p").get(0).text();
        if (result.rank == "") result.rank = data.get(0).select("p").get(0).select("img").attr("alt").replace("등", "");

        data = org.jsoup.Jsoup.connect(url).get()
            .select("div.char_info").select("dd");
        result.lv = tmp.get(0).text().replace("LV.", "");
        result.job = tmp.get(1).text();
        var job = result.job.split("/");
        if (job[0] == job[1]) result.job = job[0];
        result.server = tmp.get(2).text();
        return result;
    } catch (e) {
        return nukk;
    }
}

response = (room, msg, sender, isGroupChat, replier, ImageDB, packageName) => {
    var cmd = msg.split(" ");
    if (cmd[0] == "/메") {
        var result = Maple.getCharInfo(cmd[1]);
        if (result == null) replier.reply("해당 캐릭터를 찾을 수 없습니다.");
        else replier.reply("이름 : " + result.name +
            "\n레벨 : " + result.level +
            "\n경험치 : " + result.exp +
            "\n직업 : " + result.job +
            "\n월드 : " + result.server +
            "\n랭킹 : " + result.rank +
            "\n인기도 : " + result.pri +
            "\n랭킹 : " + result.rank);
    }
}

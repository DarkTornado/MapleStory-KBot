/*
MapleStory Bot
© 2021 Dark Tornado, All rights reserved.
*/


const Maple = {};
COMPRESS = "\u200b".repeat(500);
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
        result.level = data.get(0).text().replace("LV.", "");
        result.job = data.get(1).text();
        var job = result.job.split("/");
        if (job[0] == job[1]) result.job = job[0];
        result.server = data.get(2).text();
        return result;
    } catch (e) {
        print(e);
        return null;
    }
};
Maple.getDojangInfo = (name) => {
    try {
        var data = org.jsoup.Jsoup.connect("https://maple.gg/u/" + name).get()
            .select("section[class=box user-summary-box]").get(0);
        var result = {};
        result.floor = data.select("h1").text().replace(" 층", "층");
        result.time = data.select("small").text();
        data = data.select("footer").select("span"),
            result.rank = data.get(2).text();
        result.rank_world = data.get(1).text();
        result.date = data.get(3).text().split(": ")[1];
        return result;
    } catch (e) {
        return null;
    }
}
Maple.getRoyalStyle = () => {
    var data = org.jsoup.Jsoup.connect("https://orng-api.nexon.com/api/services/maplestory/dashboard")
        .ignoreContentType(true).ignoreHttpErrors(true).get().text();
    data = JSON.parse(data);
    data = data.data.charts;
    var result = [" === " + data[3].title + " === \n", " === " + data[4].title + " === \n"];
    for (var n = 0; n < data[3].dataSet.length; n++) {
        result[0] += "\n" + data[3].dataSet[n].trialresult_name +
            "\n └" + Number(data[3].dataSet[n].realprob) + "% (" + Number(data[3].dataSet[n].prob) + "%)";
        result[1] += "\n" + data[4].dataSet[n].trialresult_name +
            "\n └" + Number(data[4].dataSet[n].realprob) + "% (" + Number(data[4].dataSet[n].prob) + "%)";
    }
    return "[로얄 스타일 모니터링 정보]" + Maple.COMPRESS + "\n\n" + result[0] + "\n\n\n" + result[1];
}

response = (room, msg, sender, isGroupChat, replier, ImageDB, packageName) => {
    var cmd = msg.split(" ");
    if (cmd[0] == "/메") {
        var result = Maple.getCharInfo(cmd[1]);
        if (result == null) replier.reply("해당 캐릭터를 찾을 수 없습니다.");
        else replier.reply("이름 : " + cmd[1] +
            "\n레벨 : " + result.level +
            "\n경험치 : " + result.exp +
            "\n직업 : " + result.job +
            "\n월드 : " + result.server +
            "\n랭킹 : " + result.rank +
            "\n인기도 : " + result.pri +
            "\n랭킹 : " + result.rank);
    }
    if (cmd[0] == "/무릉") {
        var result = Maple.getDojangInfo(cmd[1]);
        if (result == null) replier.reply("해당 캐릭터 또는 무릉 기록을 찾을 수 없습니다.");
        else replier.reply("이름 : " + cmd[1] +
            "\n층수 : " + result.floor +
            "\n걸린시간 : " + result.time +
            "\n랭킹 : " + result.rank +
            "\n월드랭킹 : " + result.rank_world +
            "\n도전일 : " + result.date);
    }
    if (msg == "/로얄") {
        replier.reply(Maple.getRoyalStyle());
    }
}


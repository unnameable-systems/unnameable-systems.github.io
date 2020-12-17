function setLock(db, lock) {
    $(`#${db}`).toggleClass("dbbtn-locked", lock);
    $(`#${db} .lockIcon`).toggleClass("fa-lock-open", !lock).toggleClass("fa-lock", lock);
}

$(document).ready(() => {
    $.getJSON("hosts.json", hosts => {
        function checkToken(token) {
            $("#codeStatus").text(token ? "Using saved access code" : "No access code in use");

            $.each(hosts, (db, v) => {
                if (!v.host) {
                    $.ajax({
                        url: v.url,
                        xhrFields: {
                            withCredentials: true
                        }
                    }).done(
                        () => setLock(db, false)
                    ).fail(jqXHR => {
                        setLock(db, !v.open);

                        if (jqXHR.status == 401) {
                            return;
                        }

                        setLock(db, true);

                        $(`#${db}`).addClass("dbbtn-offline");
                        $(`#${db} .lockIcon`).before('<span class="text-danger icon offlineIcon">Offline <span class="fa fa-plug"></span></span>');
                    });

                    return;
                }

                $.getJSON(`https://${v.host}/auth/verify`, {
                    "token": token
                }).done(
                    j => setLock(db, !j.auth && !v.open)
                ).fail(() => {
                    setLock(db, true);

                    $(`#${db}`).addClass("dbbtn-offline");
                    $(`#${db} .lockIcon`).before('<span class="text-danger icon offlineIcon">Offline <span class="fa fa-plug"></span></span>');
                });
            });
        }

        var dbhtml = "";

        $.each(hosts, (db, v) => {
            var dbName = v.name;
            var versionSign = v.version ? `<span class="text-secondary icon version">${v.version}</span>` : "";

            var html = "";

            if (v.startOfRow) {
                if (dbhtml !== "") {
                    dbhtml += "<br><br>";
                }
                dbhtml += `<label class="control-label">${v.startOfRow}</label><br>`;
            }

            dbhtml += `
                <button class="btn btn-outline-secondary dbbtn dbbtn-locked" id="${db}" data-url="${v.url}" title="${dbName}">
                    <img src="img/${db}.min.png"></img>
                    <span class="text-dark fa fa-lock icon lockIcon"></span>${versionSign}
                </button>`;
        });

        $("#dbbtnList").html(dbhtml);

        checkToken(Cookies.get("token") || "");

        $("#accessModal").on('hide.bs.modal', () => $("#codeInput").val(""));

        $('#enterCode').click(() => {
            var token = "";
            var loginArgs = "";

            var code = $("#codeInput").val();
            if (code) {
                token = sha256(code);
                Cookies.set("token", token, {expires: 30});

                loginArgs = `?token=${token}`;
            }
            else {
                alert("Access code has been cleared.", "success");

                Cookies.remove("token");
            }

            window.open("https://gena-miner.rcg.sfu.ca/login.html" + loginArgs, "_blank");
            setTimeout(() => checkToken(token), 1600);

            $("#accessModal").modal("hide");
        });

        $(".dbbtn").click(e => {
            var target = e.currentTarget;
            if ($(target).hasClass("dbbtn-offline")) {
                alert("This service is temporarily unavailable right now.", "warning");
            }
            else if ($(target).hasClass("dbbtn-locked")) {
                alert("You do not have access to this service.", "danger");
            }
            else {
                window.location.href = $(target).attr("data-url");
            }
        });

        $("[title]").tooltip({placement: "top", html: true, container: 'body'});
    });
});

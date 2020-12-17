function alert(message, type, func) {
    var icon = "";
    switch (type) {
        case "danger":
            icon = `<i class="text-danger fa fa-3x fa-times-circle"></i>`;
            break;
        case "warning":
            icon = `<i class="text-warning fa fa-3x fa-exclamation-triangle"></i>`;
            break;
        case "info":
            icon = `<i class="text-info fa fa-3x fa-info-circle"></i>`;
            break;
        case "question":
            icon = `<i class="text-primary fa fa-3x fa-question-circle"></i>`;
            break;
        case "success":
            icon = `<i class="text-success fa fa-3x fa-check-square"></i>`;
            break;
        default:
            icon = type;
    }

    $.when(
        $("#alertModalIcon").html(icon),
        $("#alertModalMessage").html(message),
        $("#alertModal").on("hidden.bs.modal", () => {
            if (func) {
                func();
            }
        })
    ).done(
        () => $("#alertModal").modal("show")
    );
}

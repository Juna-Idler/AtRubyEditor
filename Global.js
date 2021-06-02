

var ModeTextInitializer;
var ModeRubyInitializer;

(function ModeShifter(){

const tab_text = document.getElementById("TabText");
const tab_ruby = document.getElementById("TabRuby");

var LastMode = "text";

function TabChange(e)
{
    let text_data = "";
    switch (LastMode)
    {
        case "text":
            if (tab_text.checked) return;
            text_data = ModeTextInitializer.Terminalize();
        break;
        case "ruby":
            if (tab_ruby.checked) return;
            text_data = ModeRubyInitializer.Terminalize();
        break;
    }


    if (tab_text.checked)
    {
        ModeTextInitializer.Initialize(text_data);
        LastMode = "text";
    }
    else if (tab_ruby.checked)
    {
        ModeRubyInitializer.Initialize(text_data);
        LastMode = "ruby";
    }
}


tab_text.addEventListener("change",TabChange);
tab_ruby.addEventListener("change",TabChange);

}());


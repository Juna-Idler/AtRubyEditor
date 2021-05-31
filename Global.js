
const textarea = document.getElementById("InputText");

const list = document.getElementById("LineList");


const ruby_text = document.getElementById("RubyText");
const base_text = document.getElementById("BaseText");

const ruby_control = document.getElementById("RubyControl");
const unite_left_button = document.getElementById("UniteLeft");
const division_button = document.getElementById("Division");
const unite_right_button = document.getElementById("UniteRight");

const addremove_button = document.getElementById("RubyAddRemove");
const delete_button = document.getElementById("Delete");


var pickupElement = null;




function keydown(e)
{
    switch (e.code)
    {
        case "ArrowLeft":
        break;
        case "ArrowRight":
        break;
        case "ArrowUp":
        break;
        case "ArrowDown":
        break;

        case "Space":
        case "Enter":
        break;
        case "Delete":
        break;
    }
}

function ResetUniteButton()
{
    const prev = pickupElement.previousElementSibling;
    unite_left_button.disabled = (prev == null || prev.tagName.toLowerCase() !== "ruby");
    const next = pickupElement.nextElementSibling;
    unite_right_button.disabled = (next == null || next.tagName.toLowerCase() !== "ruby");
}

function ResetPickupControl()
{
    if (pickupElement.tagName.toLowerCase() == "ruby")
    {
        ruby_text.value = pickupElement.dataset.ruby;
        base_text.value = pickupElement.dataset.base;
        ruby_control.style.display = null;
        addremove_button.value = "削除";
        addremove_button.disabled = false;
        ResetUniteButton();

        delete_button.style.visibility = "hidden";

    }
    else
    {
        ruby_text.value = "";
        base_text.value = pickupElement.textContent;
        ruby_control.style.display = "none";
        addremove_button.value = "追加";
        addremove_button.disabled = true;

        delete_button.style.visibility = null;
    }
    delete_button.disabled = true;   
}

ruby_text.oninput = (e)=>
{
    if (pickupElement.tagName.toLowerCase() == "ruby")
    {
        if (ruby_text.value != "" && base_text.value != "" &&
            pickupElement.dataset.ruby != ruby_text.value)
        {
            const ruby = pickupElement;

            ruby.dataset.ruby = ruby_text.value;
            const rt = ruby.firstElementChild;
            rt.textContent = ruby_text.value;
        }
    }
}

base_text.oninput = (e)=>
{
    if (pickupElement.tagName.toLowerCase() == "ruby")
    {
        if (ruby_text.value != "" && base_text.value != "" && pickupElement.dataset.base != base_text.value)
        {
            const ruby = pickupElement;
            ruby.firstChild.data = base_text.value;
            ruby.dataset.base = base_text.value;
        }
    }
    else
    {
        if (pickupElement.nextElementSibling == null)
        {
            pickupElement.textContent = base_text.value;
        }
        else
        {
            if (base_text.value != "" && base_text.value != pickupElement.textContent)
            {
                pickupElement.textContent = base_text.value;
            }
            delete_button.disabled = base_text.value != "";
        }
    }
}
document.onselectionchange = (e)=>
{
    if (pickupElement.tagName.toLowerCase() == "ruby")
    {
        const rs = ruby_text.selectionStart,re = ruby_text.selectionEnd;
        const bs = base_text.selectionStart,be = base_text.selectionEnd;
        division_button.disabled = 
            !(rs ==  re && rs != 0 && re != ruby_text.value.length && bs ==  be && bs != 0 && be != base_text.value.length);
    }
    else
    {
        if (ruby_text.value != "" && base_text.selectionStart != base_text.selectionEnd)
            addremove_button.disabled = false;
        else
            addremove_button.disabled = true;
    }

}

addremove_button.onclick = (e)=>
{
    if (pickupElement.tagName.toLowerCase() == "ruby")
    {
        const prev = pickupElement.previousElementSibling;
        const next = pickupElement.nextElementSibling;

        let new_text = base_text.value;
        const remove_array = [];
        if (prev != null && prev.tagName.toLowerCase() === "span")
        {
            new_text = prev.textContent + new_text;
            remove_array.push(prev);
        }
        if (next != null && next.tagName.toLowerCase() === "span")
        {
            new_text += next.textContent;
            remove_array.push(next);
        }
        const new_span = CreateNotRubyElement(new_text);
        pickupElement.parentElement.insertBefore(new_span,pickupElement);
        remove_array.forEach(a=>a.remove());
        pickupElement.remove();
        pickupElement = new_span;

        ResetPickupControl();
    }
    else
    {
        const bs = base_text.selectionStart,be = base_text.selectionEnd;
        if (ruby_text.value == "" || bs == be)
            return;

        const base1 = base_text.value.substring(0,bs);
        const base2 = base_text.value.substring(bs,be);
        const base3 = base_text.value.substring(be);

        const li = pickupElement.parentElement;
        if (base1 != "")
            li.insertBefore(CreateNotRubyElement(base1),pickupElement);
        const new_ruby = CreateRubyElement(base2,ruby_text.value);
        li.insertBefore(new_ruby,pickupElement);
        if (base3 != "" || pickupElement.nextElementSibling == null)
            li.insertBefore(CreateNotRubyElement(base3),pickupElement);

        pickupElement.remove();
        pickupElement = new_ruby;
    
        ResetPickupControl();
    }
}

delete_button.onclick = (e)=>
{
    if (pickupElement.tagName.toLowerCase() != "ruby" && base_text.value == "" && pickupElement.nextElementSibling != null)
    {
        const next = pickupElement.nextElementSibling;
        pickupElement.remove();
        pickupElement = next;

        ResetPickupControl();
    }
}

function CreateRubyElement(base,ruby)
{
    const ruby_element = document.createElement("ruby");
    ruby_element.textContent = base;
//dom探索面倒なのでdatasetにぶち込む
    ruby_element.dataset.ruby = ruby;
    ruby_element.dataset.base = base;
    ruby_element.onclick = (e)=>
    {
        pickupElement = e.currentTarget;
        ResetPickupControl();
    }
    
    const rt = document.createElement("rt");
    rt.textContent = ruby;
    ruby_element.appendChild(rt);
    return ruby_element;
}
function CreateNotRubyElement(text)
{
    const text_element = document.createElement("span");
    text_element.textContent = text;
    text_element.onclick = (e)=>
    {
        pickupElement = e.currentTarget;
        ResetPickupControl();
    }
    return text_element;
}

division_button.onclick = (e)=>
{
    const rs = ruby_text.selectionStart,re = ruby_text.selectionEnd;
    const bs = base_text.selectionStart,be = base_text.selectionEnd;
    if (rs ==  re && rs != 0 && re != ruby_text.value.length &&
        bs ==  be && bs != 0 && be != base_text.value.length)
    {
        const base1 = base_text.value.substring(0,bs);
        const base2 = base_text.value.substring(bs);
        const ruby1 = ruby_text.value.substring(0,rs);
        const ruby2 = ruby_text.value.substring(rs);

        const rubyelem1 = CreateRubyElement(base1,ruby1);
        const rubyelem2 = CreateRubyElement(base2,ruby2);

        const li = pickupElement.parentElement;

        li.insertBefore(rubyelem1,pickupElement);
        li.insertBefore(rubyelem2,pickupElement);
        pickupElement.remove();
        pickupElement = rubyelem1;
        ruby_text.value = pickupElement.dataset.ruby;
        base_text.value = pickupElement.dataset.base;

        ResetUniteButton();
        division_button.disabled = true;
    }

}
unite_left_button.onclick = (e)=>
{
    const prev = pickupElement.previousElementSibling;
    const united_ruby = CreateRubyElement(prev.dataset.base + pickupElement.dataset.base,prev.dataset.ruby + pickupElement.dataset.ruby);

    const li = pickupElement.parentElement;
    li.insertBefore(united_ruby,pickupElement);
    pickupElement.remove();
    prev.remove();
    pickupElement = united_ruby;
    ruby_text.value = pickupElement.dataset.ruby;
    base_text.value = pickupElement.dataset.base;

    ResetUniteButton();
}
unite_right_button.onclick = (e)=>
{
    const next = pickupElement.nextElementSibling;
    const united_ruby = CreateRubyElement(pickupElement.dataset.base + next.dataset.base,pickupElement.dataset.ruby + next.dataset.ruby);

    const li = pickupElement.parentElement;
    li.insertBefore(united_ruby,pickupElement);
    pickupElement.remove();
    next.remove();
    pickupElement = united_ruby;
    ruby_text.value = pickupElement.dataset.ruby;
    base_text.value = pickupElement.dataset.base;

    ResetUniteButton();
}

//function Initialize()
{
    var text = new RubyText(textarea.value);


    text.lines.forEach(line=>{
        const li = document.createElement("li");
        li.classList.add("Line");
        li.onclick = (e)=>{
            if (e.currentTarget !== e.target)
                return;
            pickupElement = li.lastElementChild;
            ResetPickupControl();
        };

        line.units.forEach(unit=>{
            if (unit.hasRuby)
            {
                li.appendChild(CreateRubyElement(unit.base,unit.ruby));
            }
            else
            {
                li.appendChild(CreateNotRubyElement(unit.base));
            }
        });
        if (li.lastElementChild == null || li.lastElementChild.tagName.toLowerCase() == "ruby")
        {
            li.appendChild(CreateNotRubyElement(""));
        }
        list.appendChild(li);
    });
    pickupElement = list.firstElementChild.firstElementChild;

}
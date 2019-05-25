
class CiJSListBox
{
	constructor(id)
	{
        this._id = id;
    }

    AddItemToEnd(Text, Value)
    {
        document.getElementById(this._id).insertAdjacentHTML('beforeend', '<option value=' + Value + '>' + Text + '</option>');
    }

    RemoveAllItems()
    {
        document.getElementById(this._id).innerHTML = "";
    }

    GetSelectedIndex()
    {
        return parseInt(document.getElementById(this._id).value);
    }

    GetSelectedText()
    {
        let e = document.getElementById(this._id);

        return e.options[e.selectedIndex].text;
    }

    SetSelectedIndex(Index)
    {
        document.getElementById(this._id).value = Index;
    }
}



let searchBox = document.getElementById('search');
searchBox.addEventListener('input', debouncedSearch(() => {
    fetch(`https://api.github.com/search/repositories?q=${searchBox.value}`)
        .then(response => response.json())
        .then(json => {
            let elem = document.querySelector('.search-results');
            let item = dropdownList(json.items);
            elem.replaceWith(item);
        })
        .catch(e => console.log("There is no match."));
}, 2000));









function createChosenItem(name, owner, stars) {
    let ul = document.createElement('ul');
    let li = document.createElement('li');
    li.innerText = `Name: ${name}`;
    ul.appendChild(li);
    li = document.createElement('li');
    li.innerText = `Owner: ${owner}`;
    ul.appendChild(li);
    li = document.createElement('li');
    li.innerText = `Stars: ${stars}`;
    ul.appendChild(li);

    let elem = document.createElement('div');
    elem.classList.add('chosenItem');
    let cross = document.createElement('span');
    cross.classList.add('cross');
    cross.innerHTML = `<i class="fa-2x fa fa-times" aria-hidden="true"></i>`;
    cross.addEventListener('click', (e) => {
       e.target.parentElement.parentElement.remove();
    });
    elem.appendChild(cross);
    elem.appendChild(ul);
    return elem;
}


function dropdownList(arr) {
    let list = document.createElement('ul');
    list.className = "search-results";
    if(arr.length === 0) {
        list.appendChild(dropdownElement("There is no such item", false));
        return list;
    }
    let items = 5;
    if(arr.length < 5) items = arr.length;
    for(let i = 0; i < items; i++ ) {
        let elem = dropdownElement(arr[i].name);
        elem = addDataAttr(elem, arr[i]);
        list.appendChild(elem);
    }
    return list;
}


function dropdownElement(name, found = true) {
    const elem = document.createElement('li');
    elem.classList.add('search-result-item');
    elem.innerText = name;
    elem.addEventListener('click', (e) => {
        if(found) {
            let elem = createChosenItem(e.target.textContent, e.target.dataset.owner, e.target.dataset.stars);
            let container = document.querySelector('.allTheChosen');
            container.appendChild(elem);
        }
        e.target.parentElement.innerHTML = "";
        document.getElementById('search').value = "";
    })
    return elem;
}

function addDataAttr(elem, attrObj) {
    elem.dataset.owner = attrObj.owner.login;
    elem.dataset.stars = attrObj.stargazers_count;
    return elem;
}


function debouncedSearch(fn, deboucneTime) {
    let timeStamp = 0;
    return () => {
        clearTimeout(timeStamp);
        timeStamp = setTimeout(() => {
            fn();
        }, deboucneTime)
    }
}

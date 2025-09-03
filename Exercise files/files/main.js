/* A builder class to simplify the task of creating HTML elements */
class ElementCreator {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {

        this.element.className = clazz;
        return this;
    }

    text(content) {
        this.element.innerHTML = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value)
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener)
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    prependTo(parent) {
        parent.prepend(this.element);
        return this.element;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }

    replace(parent, sibling) {
        parent.replaceChild(this.element, sibling);
        return this.element;
    }
}

/* A class representing a resource. This class is used per default when receiving the
   available resources from the server (see end of this file).
   You can (and probably should) rename this class to match with whatever name you
   used for your resource on the server-side.
 */
class Car {

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get idforDOM() {
        return `cars-${this.id}`;
    }

}

function add(resource, sibling) {

    const creator = new ElementCreator("article").id(resource.idforDOM);

    /* Task 2: Instead of the name property of the example resource, add the properties of
       your resource to the DOM. If you do not have the name property in your resource,
       start by removing the h2 element that currently represents the name. For the
       properties of your object you can use whatever html element you feel represents
       your data best, e.g., h2, paragraphs, spans, ...
       Also, you don't have to use the ElementCreator if you don't want to and add the
       elements manually. */

    creator
        .append(new ElementCreator("h2").text(`${resource.brand} — ${resource.horsepower} PS`))
        .append(new ElementCreator("p").text(`Kupplung: ${resource.hasClutch ? "Ja (Schaltgetriebe)" : "Nein (Automatik/E-Auto)"}`));

    // Edit-Button
    creator.append(
        new ElementCreator("button")
            .text("Edit")
            .listener("click", () => { edit(resource); })
    );

    // Remove-Button (Task 3: erst serverseitig löschen, dann DOM updaten)

    creator.append(
        new ElementCreator("button")
            .text("Remove")
            .listener("click", async () => {
                try {
                    const res = await fetch(`/api/cars/${resource.id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error(`DELETE failed with ${res.status}`);
                    remove(resource); // DOM nach Delete
                } catch (e) {
                    alert("Löschen fehlgeschlagen: " + e.message);
                }
            })
    );

    const parent = document.querySelector('main');

    if (sibling) {
        creator.replace(parent, sibling);
    } else {
        creator.insertBefore(parent, document.querySelector('#bottom'));
    }

}

function edit(resource) {
    const formCreator = new ElementCreator("form")
        .id(resource.idforDOM)
        .append(new ElementCreator("h3").text("Edit " + resource.brand));

    /* Task 4 - Part 1: Instead of the name property, add the properties your resource has here!
       The label and input element used here are just an example of how you can edit a
       property of a resource, in the case of our example property name this is a label and an
       input field. Also, we assign the input field a unique id attribute to be able to identify
       it easily later when the user saves the edited data (see Task 4 - Part 2 below).
    */

    formCreator
        .append(new ElementCreator("label").text("Marke/Modell").with("for", "car-brand"))
        .append(new ElementCreator("input").id("car-brand").with("type", "text").with("value", resource.brand))

        // horsepower (Number)
        .append(new ElementCreator("label").text("PS").with("for", "car-hp"))
        .append(new ElementCreator("input").id("car-hp").with("type", "number").with("value", resource.horsepower))

        // hasClutch (Boolean)
        .append(new ElementCreator("label").text("Kupplung vorhanden?").with("for", "car-clutch"))
        .append(new ElementCreator("input").id("car-clutch").with("type", "checkbox").with("checked", resource.hasClutch ? "checked" : null));

    /* In the end, we add the code to handle saving the resource on the server and terminating edit mode */
    formCreator
        .append(new ElementCreator("button").text("Speichern").listener('click', (event) => {
            /* Why do we have to prevent the default action? Try commenting this line.
            *Ohne dem würden man nie den asynchronen Code ausführen sondern immer die Default Page laden */
            event.preventDefault();

            /* The user saves the resource.
               Task 4 - Part 2: We manually set the edited values from the input elements to the resource object.
               Again, this code here is just an example of how the name of our example resource can be obtained
               and set in to the resource. The idea is that you handle your own properties here.
            */

            resource.brand = document.getElementById("car-brand").value.trim();
            resource.horsepower = Number(document.getElementById("car-hp").value);
            resource.hasClutch = document.getElementById("car-clutch").checked;

            /* Task 4 - Part 3: Call the update endpoint asynchronously. Once the call returns successfully,
               use the code below to remove the form we used for editing and again render
               the resource in the list.
            */

            fetch(`/api/cars/${resource.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resource),
            })
                .then(res => {
                    if (!res.ok) throw new Error(`PUT failed with ${res.status}`);
                    add(resource, document.getElementById(resource.idforDOM));  // <- Call this after the resource is updated successfully on the server
                })
                .catch(err => alert("Speichern fehlgeschlagen: " + err.message));
        }))
        .replace(document.querySelector('main'), document.getElementById(resource.idforDOM));
}

function remove(resource) {
    document.getElementById(resource.idforDOM).remove();
}

/* Task 5 - Create a new resource is very similar to updating a resource. First, you add
   an empty form to the DOM with the exact same fields you used to edit a resource.
   Instead of PUTing the resource to the server, you POST it and add the resource that
   the server returns to the DOM (Remember, the resource returned by the server is the
    one that contains an id).
 */
function create() {

    if (document.getElementById("create-form")) return;

    const formCreator = new ElementCreator("form")
        .id("create-form")
        .append(new ElementCreator("h3").text("Neues Auto anlegen"))

        // brand
        .append(new ElementCreator("label").text("Marke/Modell").with("for", "new-brand"))
        .append(new ElementCreator("input").id("new-brand").with("type", "text"))

        // horsepower
        .append(new ElementCreator("label").text("PS").with("for", "new-hp"))
        .append(new ElementCreator("input").id("new-hp").with("type", "number").with("value", 100))

        // hasClutch
        .append(new ElementCreator("label").text("Kupplung vorhanden?").with("for", "new-clutch"))
        .append(new ElementCreator("input").id("new-clutch").with("type", "checkbox"))

        // POST
        .append(new ElementCreator("button").text("Anlegen").listener("click", (e) => {
            e.preventDefault();

            const payload = {
                brand: document.getElementById("new-brand").value.trim(),
                horsepower: Number(document.getElementById("new-hp").value),
                hasClutch: document.getElementById("new-clutch").checked,
            };

            fetch("/api/cars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then(res => {
                    if (!res.ok) throw new Error(`POST failed with ${res.status}`);
                    return res.json();
                })
                .then(created => {
                    // EXPLAIN: Der Server vergibt die id. Wir mappen auf Car-Instanz und rendern.
                    add(Object.assign(new Car(), created));
                    document.getElementById("create-form").remove();
                })
                .catch(err => alert("Anlegen fehlgeschlagen: " + err.message));
        }));

    // Formular oberhalb von #bottom einfügen (analog zu add(...))
    formCreator.insertBefore(document.querySelector("main"), document.querySelector("#bottom"));
}


document.addEventListener("DOMContentLoaded", function (event) {

    fetch("/api/cars")
        .then(response => response.json())
        .then(resources => {
            for (const resource of resources) {
                // EXPLAIN: Mapping der JSON-Objekte (plain) auf unsere Client-Klasse Car,
                // damit Getter (idforDOM) usw. funktionieren.
                add(Object.assign(new Car(), resource));
            }
        })
        .catch(err => alert("Laden fehlgeschlagen: " + err.message));
});

async function readTextFile(file) {
    return new Promise((resolve, reject) =>    {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                resolve(rawFile.responseText);
            }
        }
        rawFile.send(null);
    });
}
class Elements {

    static titleElement(parent, type, id, title) {
        const element = document.createElement(type);
        element.append(title);
        element.id = id;
        parent.appendChild(element);
    }

    static async listElement(parent, type, list, key, title, isLink = false) {
        const element = document.createElement(type);
        const titleElement = document.createElement("h3");
        titleElement.append(title);
        element.appendChild(titleElement);

        list.forEach(item => {
            const listItem = document.createElement("li");
            if (isLink) {
                const link = document.createElement("a");
                link.href = item[key];
                link.target = "_blank"
                link.append(item[key]);
                listItem.append(link);
            } else {
                listItem.append(item[key].toLowerCase());
            }
            element.appendChild(listItem);
        });

        parent.appendChild(element);
    }

    static async contentElement(parent, contents, keys, className, title) {
        const element = document.createElement("div");
        const titleElement = document.createElement("h2");
        titleElement.append(title);
        element.appendChild(titleElement);

        contents.forEach(item => {
            keys.forEach(key => {
                const innerElement = document.createElement(key.type);
                if (key.id === "thesis") {
                    innerElement.append(`Thesis title: ${item[key.id]}`);
                } else {
                    innerElement.append(item[key.id]);
                }
                element.appendChild(innerElement);
            });
        });
        element.className = className;

        parent.appendChild(element);
    }
}

async function app() {
    const json = await readTextFile("cv/resume.json");
    const resume = JSON.parse(json);

    console.log(resume);
    const main = document.getElementById("container");

    Elements.titleElement(container, "h1", "name", resume.name.toLowerCase());
    Elements.titleElement(container, "h1", "title", resume.title.toLowerCase());
    Elements.titleElement(container, "h3", "contact", "contact:");
    Elements.titleElement(container, "p", "phone", resume.contact.phone);
    Elements.titleElement(container, "p", "email", resume.contact.email);
    Elements.listElement(container, "ul", resume.social, "link", "Social:", true);

    const workKeys = [
        {"type": "h3", "id": "position"},
        {"type": "h5", "id": "period"},
        {"type": "p", "id": "description"}
    ];
    Elements.contentElement(container, resume.work, workKeys, "main", "work experience:");

    const volunteeringKeys = [
        {"type": "h3", "id": "date"},
        {"type": "h5", "id": "location"},
        {"type": "h5", "id": "position"},
        {"type": "p", "id": "description"}
    ];
    Elements.contentElement(container, resume.volunteering, volunteeringKeys, "main", "volunteering:");

    const workshopKeys = [
        {"type": "h3", "id": "date"},
        {"type": "h5", "id": "location"},
        {"type": "p", "id": "description"}
    ];
    Elements.contentElement(container, resume.workshops, workshopKeys, "main", "hackathons and workshops:");

    const educationKeys = [
        {"type": "h3", "id": "period"},
        {"type": "h3", "id": "location"},
        {"type": "h5", "id": "title"},
        {"type": "h5", "id": "thesis"},
    ];
    Elements.contentElement(container, resume.education, educationKeys, "main", "education:");

    Elements.listElement(container, "ul", resume.programming.languages, "name", "programming languages:");
    Elements.listElement(container, "ul", resume.languages, "language", "language skills:");
    Elements.listElement(container, "ul", resume.interests, "name", "interests");
}

app();
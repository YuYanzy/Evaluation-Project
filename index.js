const editIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>';

const deletIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>';

const saveIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>';

const cancelIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>'

const addIcon = '<svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'



const API = (() => {
    const URL = "http://localhost:3000/events";

    const getEvents = () => {
        return fetch(URL)
            .then(response => response.json());
    };

    const postEvent = (newEvent) => {
        return fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent),
        }).then(response => response.json())
    }

    const deleteEvent = (id) => {
        return fetch(`${URL}/${id}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    };

    const updateEvent = (id, modifiedEvent) => {
        return fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(modifiedEvent),
        }).then(response => response.json())
    };

    return {
        getEvents,
        postEvent,
        deleteEvent,
        updateEvent
    };
})();

class EventModel {
    #events;
    constructor() {
        this.#events = [];
    }

    setEvents(events) {
        this.#events = events;
    }

    fetchEvents() {
        return API.getEvents().then(events => {
            this.setEvents(events);
            return events;
        })
    }
    getEvents() {
        return this.#events;
    }

    addEvent(event) {
        return API.postEvent(event).then(newEvent => {
            this.#events.push(newEvent);
            return newEvent;
        })
    }

    modifyEvent(id, event) {
        return API.updateEvent(id, event).then(modifiedEvent => {
            this.#events = this.#events.map(event => event.id === modifiedEvent.id ? modifiedEvent : event);
            return modifiedEvent;
        })
    }

    deleteEvent(id) {
        return API.deleteEvent(id).then((removedEvent) => {
            this.#events = this.#events.filter(event => event.id !== +id);
            return removedEvent;
        })
    }

}


class EventView {
    constructor() {
        this.addBtn = document.querySelector(".event_btn-Add");
        this.eventTable = document.querySelector(".event-table");
        this.eventTableBody = document.querySelector(".event-table-body");
    }

    renderEvents(events) {
        this.eventTableBody.textContent = "";
        events.forEach(event => {
            console.log(event);
            this.appendEvent(event);
        });
    }

    removeEvent(id) {
        const eventRow = document.getElementById(id);
        eventRow.remove();
    }

    appendEvent(event) {
        const tableRow = document.createElement("tr");
        tableRow.classList.add("event");
        tableRow.setAttribute("id", "event" + event.id);

        const eventNameTd = document.createElement("td");
        eventNameTd.classList.add("event_name");
        const eventNameInput = document.createElement("input");
        eventNameInput.setAttribute("type", "text");
        eventNameInput.setAttribute("value", event.eventName);
        eventNameInput.setAttribute("disabled", "disabled");
        eventNameTd.appendChild(eventNameInput);

        const startDateTd = document.createElement("td");
        startDateTd.classList.add("event_startDate");
        const startDateInput = document.createElement("input");
        startDateInput.setAttribute("type", "date");
        startDateInput.setAttribute("value", event.startDate);
        startDateInput.setAttribute("disabled", "disabled");
        startDateTd.appendChild(startDateInput);

        const endDateTd = document.createElement("td");
        endDateTd.classList.add("event_endDate");
        const endDateInput = document.createElement("input");
        endDateInput.setAttribute("type", "date");
        endDateInput.setAttribute("value", event.endDate);
        endDateInput.setAttribute("disabled", "disabled");
        endDateTd.appendChild(endDateInput);

        const actionTd = document.createElement("td");
        actionTd.classList.add("event_action");
        const editBtn = document.createElement("button");
        editBtn.classList.add("event_btn-Edit");
        editBtn.setAttribute("status", "edit")
        editBtn.innerHTML = editIcon;
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("event_btn-Delete");
        deleteBtn.setAttribute("status", "delete")
        deleteBtn.innerHTML = deletIcon;
        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);

        tableRow.append(eventNameTd, startDateTd, endDateTd, actionTd);
        this.eventTableBody.appendChild(tableRow);
    }


    addEvent(event) {
        this.appendEvent(event);
        const domID = "event" + event.id;
        const eventRow = document.getElementById(`${domID}`)
        const eventName = eventRow.querySelector(".event_name input");
        const startDate = eventRow.querySelector(".event_startDate input");
        const endDate = eventRow.querySelector(".event_endDate input");
        const editBtn = eventRow.querySelector(".event_btn-Edit");
        const deleteBtn = eventRow.querySelector(".event_btn-Delete");
        eventName.removeAttribute("disabled");
        startDate.removeAttribute("disabled");
        endDate.removeAttribute("disabled");
        editBtn.setAttribute("status", "add");
        editBtn.innerHTML = addIcon;
        deleteBtn.innerHTML = cancelIcon;
        eventName.focus();
    }
}

class EventController {
    constructor(eventView, eventModel) {
        this.eventView = eventView;
        this.eventModel = eventModel;
        this.init();
    }

    init() {
        this.setUpEvents();
        this.refreshEvents();
    }

    refreshEvents() {
        this.eventModel.fetchEvents().then(events => {
            console.log(events);
            this.eventView.renderEvents(events);
        })
    }

    setUpEvents() {
        this.setUpTableEvent();
        this.setUpAddEvent();
    }

    setUpAddEvent() {
        this.eventView.addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const event = { eventName: "", startDate: "", endDate: "" };
            this.eventModel.addEvent(event).then((newEvent) => {
                this.eventView.addEvent(newEvent);
            })
        })
    }

    setUpTableEvent() {
        this.eventView.eventTableBody.addEventListener("click", (event) => {
            if (event.target.classList.contains("event_btn-Delete")) {
                if (event.target.closest("tr").querySelector(".event_btn-Edit").getAttribute("status") !== "save") {
                    const id = event.target.closest("tr").id;
                    this.eventModel.deleteEvent(id.substr(5)).then(() => {
                        this.eventView.removeEvent(id);
                    })
                } else {
                    const id = event.target.closest("tr").id;
                    const eventName = event.target.closest("tr").querySelector(".event_name input");
                    const startDate = event.target.closest("tr").querySelector(".event_startDate input");
                    const endDate = event.target.closest("tr").querySelector(".event_endDate input");
                    const editBtn = event.target.closest("tr").querySelector(".event_btn-Edit");
                    const deleteBtn = event.target.closest("tr").querySelector(".event_btn-Delete");
                    const modifyEvent = this.eventModel.getEvents().filter((data) => data.id === +id.substr(5))[0];
                    eventName.value = modifyEvent.eventName;
                    startDate.value = modifyEvent.startDate;
                    endDate.value = modifyEvent.endDate;
                    eventName.setAttribute("disabled", "disabled");
                    startDate.setAttribute("disabled", "disabled");
                    endDate.setAttribute("disabled", "disabled");
                    editBtn.setAttribute("status", "edit");
                    editBtn.innerHTML = editIcon;
                    deleteBtn.innerHTML = deletIcon;
                }
            }
            if (event.target.classList.contains("event_btn-Edit")) {
                const id = event.target.closest("tr").id;
                const eventName = event.target.closest("tr").querySelector(".event_name input");
                const startDate = event.target.closest("tr").querySelector(".event_startDate input");
                const endDate = event.target.closest("tr").querySelector(".event_endDate input");
                const deleteBtn = event.target.closest("tr").querySelector(".event_btn-Delete");
                if (event.target.getAttribute("status") === "edit") {
                    eventName.removeAttribute("disabled");
                    startDate.removeAttribute("disabled");
                    endDate.removeAttribute("disabled");
                    event.target.setAttribute("status", "save");
                    event.target.innerHTML = saveIcon;
                    deleteBtn.innerHTML = cancelIcon;
                } else {
                    if (eventName.value === "" || startDate.value === "" || endDate.value === "") {
                        alert("Please enter all the fields")
                    } else {
                        const modifiedEvent = {
                            eventName: eventName.value,
                            startDate: startDate.value,
                            endDate: endDate.value
                        }
                        this.eventModel.modifyEvent(id.substr(5), modifiedEvent).then(() => {
                            eventName.setAttribute("disabled", "disabled");
                            startDate.setAttribute("disabled", "disabled");
                            endDate.setAttribute("disabled", "disabled");
                            event.target.setAttribute("status", "edit");
                            event.target.innerHTML = editIcon;
                            deleteBtn.innerHTML = deletIcon;
                        })
                    }
                }
            }
        })
    }
}

const eventView = new EventView();
const eventModle = new EventModel();
const eventController = new EventController(eventView, eventModle);
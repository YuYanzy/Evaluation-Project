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
        editBtn.textContent = "Edit";
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("event_btn-Delete");
        deleteBtn.textContent = "Delete";
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
        eventName.removeAttribute("disabled");
        startDate.removeAttribute("disabled");
        endDate.removeAttribute("disabled");
        editBtn.textContent = "Save";
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
                const id = event.target.closest("tr").id;
                this.eventModel.deleteEvent(id.substr(5)).then(() => {
                    this.eventView.removeEvent(id);
                })
            }
            if (event.target.classList.contains("event_btn-Edit")) {
                const id = event.target.closest("tr").id;
                const eventName = event.target.closest("tr").querySelector(".event_name input");
                const startDate = event.target.closest("tr").querySelector(".event_startDate input");
                const endDate = event.target.closest("tr").querySelector(".event_endDate input");
                if (event.target.textContent === "Edit") {
                    eventName.removeAttribute("disabled");
                    startDate.removeAttribute("disabled");
                    endDate.removeAttribute("disabled");
                    event.target.textContent = "Save";
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
                            event.target.textContent = "Edit";
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
import { resetDayViews, resetMonthViews } from "./articleViewsManager";

const TIME = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000
};

export function dayTimeOut() {
    const date = new Date();
    const hours = 23 - date.getHours();
    const minutes = 59 - date.getMinutes();
    const seconds = 59 - date.getSeconds();
    // const time = seconds * 1000;
    const time = hours * TIME.hours + minutes * TIME.minutes + seconds * TIME.seconds;

    if(!time) {
        if(date.getDate() === 1) {
            resetMonthViews();
        }

        resetDayViews();
    }

    setTimeout(dayTimeOut, time ? time : 1000);
}
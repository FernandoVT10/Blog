const regex = /\B(?=(\d{3})+(?!\d))/g;

export default (value) => {
    if(typeof value === "number") {
        return value.toString().replace(regex, " ");
    } else {
        return value.replace(regex, " ");
    }
}
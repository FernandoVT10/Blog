import { useEffect, useRef } from "react";
import Api from "../../../../ApiController";

export default ({ type }) => {
    const chart = useRef();

    useEffect(() => {
        const ctx = document.getElementById("viewsChart").getContext("2d");

        Chart.defaults.global.elements.point.borderWidth = 8;
        Chart.defaults.global.defaultFontSize = 18;
        Chart.defaults.global.defaultFontColor = "white";
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.maintainAspectRatio = false;

        chart.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                    { 
                        data: [0, 0, 0, 0, 0],
                        label: "Views",
                        borderColor: "#8BD1FF",
                        fill: false
                    }
                ]
            }
        });
    }, []);

    useEffect(() => {
        Api.get(`views/getViewsHistory/${type}/5`, true)
        .then(res => {
            const labels = res.map(({ name }) => name);
            const data = res.map(({ views }) => views);

            // Here we turn the arrays because the data is ordered by date
            labels.reverse();
            data.reverse();

            chart.current.data.labels = labels;
            chart.current.data.datasets[0].data = data;
            chart.current.update();
        });
    }, [type]);

    return (
        <canvas
        id="viewsChart"
        className="statistics-views__chart"
        width="2400"
        height="400"></canvas>
    );
};
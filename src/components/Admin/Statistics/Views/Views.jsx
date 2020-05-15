import "./Views.scss";
import { useEffect, useState } from "react";

function Views() {
    const [views, setViews] = useState({
        total: "- -",
        month: "- -",
        day: "- -" 
    });
    const [chart, setChart] = useState(null);

    useEffect(() => {
        const ctx = document.getElementById("totalViewsChart").getContext("2d");

        Chart.defaults.global.elements.point.borderWidth = 8;
        Chart.defaults.global.defaultFontSize = 18;
        Chart.defaults.global.defaultFontColor = "white";
        Chart.defaults.global.legend.display = false;

        const newChart = new Chart(ctx, {
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

        setChart(newChart);
    }, []);

    return (
        <div className="statistics-views">
            <div className="statistics-views__total-views">
                <div className="statistics-views__total-views-item">
                    <span className="statistics-views__total-views-label">
                        Total Views
                    </span>
                    <span className="statistics-views__total-views-number">
                        { views.total }
                    </span>
                </div>
                <div className="statistics-views__total-views-item">
                    <span className="statistics-views__total-views-label">
                        Month Views
                    </span>
                    <span className="statistics-views__total-views-number">
                        { views.month }
                    </span>
                </div>
                <div className="statistics-views__total-views-item disabled">
                    <span className="statistics-views__total-views-label">
                        Day Views
                    </span>
                    <span className="statistics-views__total-views-number">
                        { views.day }
                    </span>
                </div>
            </div>

            <div className="statistics-views__charts-container">
                <canvas
                id="totalViewsChart"
                className="statistics-views__chart"
                width="2400"
                height="400"></canvas>
            </div>
        </div>
    );
}

export default Views;
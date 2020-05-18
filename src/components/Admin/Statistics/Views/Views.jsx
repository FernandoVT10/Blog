import Chart from "../Chart/Chart";
import Api from "../../../../ApiController";

import { useEffect, useState } from "react";

import "./Views.scss";

function Views() {
    const [views, setViews] = useState({
        total: "- -",
        month: "- -",
        day: "- -" 
    });
    const [chartType, setChartType] = useState("month");

    useEffect(() => {
        Api.get("views/getTotalViews/", true)
        .then(data => {
            if(data.month) {
                // add spaces in the number that separates the thousands

                const total = data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const month = data.month.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const day = data.day.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                setViews({ total, month, day });
            }
        });
    }, []);

    const totalViewsItemClass = chartType === "month" ? "active" : "";
    const monthViewsItemClass = chartType === "day" ? "active" : ""; 

    return (
        <div className="statistics-views">
            <div className="statistics-views__total-views">
                <div
                className={`statistics-views__total-views-item ${totalViewsItemClass}`}
                onClick={() => setChartType("month")}>
                    <span className="statistics-views__total-views-label">
                        Total Views
                    </span>
                    <span className="statistics-views__total-views-number">
                        { views.total }
                    </span>
                </div>
                <div
                className={`statistics-views__total-views-item ${monthViewsItemClass}`}
                onClick={() => setChartType("day")}>
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
                <Chart type={chartType}/>
            </div>
        </div>
    );
}

export default Views;
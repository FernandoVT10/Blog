import Chart from "./Chart/Chart";

import ApiController from "../../../../services/ApiController";
import separateThousands from "../../../../services/separateThousands";

import { useEffect, useState } from "react";

import "./Views.scss";

export default () => {
    const [views, setViews] = useState({
        total: "- -",
        month: "- -",
        day: "- -" 
    });
    const [chartType, setChartType] = useState("month");

    useEffect(() => {
        ApiController.get("articles/views/getTotalViews/", true)
        .then(res => {
            if(res.data) {
                const { views } = res.data;

                const total = separateThousands(views.total);
                const month = separateThousands(views.month);
                const day = separateThousands(views.day);

                setViews({ total, month, day });
            }
        });
    }, []);

    const totalViewsItemClass = chartType === "month" ? "active" : "";
    const monthViewsItemClass = chartType === "day" ? "active" : ""; 

    return (
        <div className="dashboard-views">
            <div className="dashboard-views__total-views">
                <div
                className={`dashboard-views__total-views-item ${totalViewsItemClass}`}
                onClick={() => setChartType("month")}>
                    <span className="dashboard-views__total-views-label">
                        Total Views
                    </span>
                    <span className="dashboard-views__total-views-number">
                        { views.total }
                    </span>
                </div>
                <div
                className={`dashboard-views__total-views-item ${monthViewsItemClass}`}
                onClick={() => setChartType("day")}>
                    <span className="dashboard-views__total-views-label">
                        Month Views
                    </span>
                    <span className="dashboard-views__total-views-number">
                        { views.month }
                    </span>
                </div>
                <div className="dashboard-views__total-views-item disabled">
                    <span className="dashboard-views__total-views-label">
                        Day Views
                    </span>
                    <span className="dashboard-views__total-views-number">
                        { views.day }
                    </span>
                </div>
            </div>

            <div className="dashboard-views__charts-container">
                <Chart type={chartType}/>
            </div>
        </div>
    );
}
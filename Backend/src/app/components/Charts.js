"use client";
import { useEffect, useState } from "react";
import AreaChartPlot from "./AreaChartPlot";
import BarChartPlot from "./BarChart";
import PieChartPlot from "./PieChartPlot";
import RadarChartPlot from "./RadarChartPlot";
import axios from "axios";

const Charts = () => {
  const [statsData, setStats] = useState(null);

  useEffect(() => {
    console.log("in this code base", window);
    axios
      .post("/api/dashboard")
      .then((response) => {
        console.log("POST request successful:", response);
        setStats(response.data.dashboardData);
      })
      .catch((error) => {
        console.error("Error making POST request:", error);
      });
  }, []);

  function formatNumber(num) {
    return num.toString().padStart(2, "0");
  }

  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-4 py-2 justify-center w-28 bg-gray-700  rounded-md h-28 shadow-xl ">
            <div className="">
              <p className="text-white font-bold">Total Users</p>
              {statsData && (
                <p className="py-4 font-bold text-center text-xl">
                  {formatNumber(statsData?.userCount)}{" "}
                </p>
              )}
            </div>
          </div>
          <div className="flex-1 px-4 py-2 justify-center w-28 bg-gray-700  rounded-md h-28 shadow-xl ">
            <div className="">
              <p className="text-white font-bold">Total Buyers</p>
              {statsData && (
                <p className="py-4 font-bold text-center text-xl">
                  {formatNumber(statsData?.buyerCount)}{" "}
                </p>
              )}
            </div>
          </div>
          <div className="flex-1 px-4 py-2 justify-center w-28 bg-gray-700  rounded-md h-28 shadow-xl ">
            <div className="">
              <p className="text-white font-bold">Total Sellers</p>
              {statsData && (
                <p className="py-4 font-bold text-center text-xl">
                  {formatNumber(statsData?.sellerCount)}{" "}
                </p>
              )}
            </div>
          </div>
          <div className="flex-1 px-4 py-2 justify-center w-28 bg-gray-700  rounded-md h-28 shadow-xl ">
            <div className="">
              <p className="text-white font-bold">Total Products</p>
              {statsData && (
                <p className="py-4 font-bold text-center text-xl">
                  {formatNumber(statsData?.productsCount)}{" "}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-96 bg-gray-700 rounded px-4 py-2 shadow-xl">
          <p className="text-center text-xl font-medium text-white">
            Products Per Seller
          </p>
          {statsData && <AreaChartPlot data={statsData.productBySeller} />}
        </div>
        <div className="w-1/2 h-96 bg-gray-700 rounded px-4 py-2 shadow-xl">
          <p className="text-center text-xl font-medium text-white">
            Products Per Month
          </p>
          {statsData && <BarChartPlot data={statsData.productCountByMonth} />}
        </div>
      </section>
      <section className="flex my-4 px-4 gap-2">
        <div className="w-1/2 h-96 bg-gray-700 rounded px-4 py-2 shadow-xl">
          <p className="text-center text-xl font-medium text-white">
            Top Products (By Transactions)
          </p>
          {statsData && (
            <PieChartPlot data={statsData.productsSoldByQuantity} />
          )}
        </div>

        <div className="w-1/2 h-96 bg-gray-700 rounded px-4 py-2 shadow-xl">
          <p className="text-center text-xl font-medium text-white">
            Transactions Per Day
          </p>
          {statsData && <RadarChartPlot data={statsData.transactionPerDay} />}
        </div>
      </section>
    </>
  );
};

export default Charts;

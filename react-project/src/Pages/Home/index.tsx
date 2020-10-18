import { Button, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
// import axios from "axios";
import request from "../../request";
import ReactEcharts from "echarts-for-react";
import "./style.css";

// 如果使用class去写
// interface State {
//     isLogin: boolean
// }
// class Home extends Component <{}, State>



interface LineData {
  name: string;
  type: string;
  data: number[];
}

interface CourseItem {
  title: string;
  count: number;
}

interface DataStructure {
  [key: string]: CourseItem[];
}

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<responseResult.DataStructure>({});

  useEffect(() => {
    request.get("/api/isLogin").then(({ data }: {data: responseResult.isLogin}) => {
      setLoading(false);
      if (data) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
    request.get("/api/showData").then(({ data }: {data:responseResult.DataStructure}) => {
      setLoading(false);
      if (data) {
        setData(data);
      } else {
        message.warn("获取数据失败");
      }
    });
  }, []);

  const handleLogoutClick = (e: React.MouseEvent) => {
    setLoading(true);
    request.get("/api/logout").then(({ data }: {data: responseResult.logout}) => {
      setLoading(false);
      if (data) {
        setIsLogin(false);
      } else {
        message.warn("退出失败");
      }
    });
  };

  const handleCrawlerClick = (e: React.MouseEvent) => {
    setLoading(true);
    request.get("/api/getData").then(({ data }: {data: responseResult.getData}) => {
      setLoading(false);
      if (data) {
        message.success("爬取成功");
        request.get("/api/showData").then(({ data }: {data: responseResult.DataStructure}) => {
          setLoading(false);
          if (data) {
            setData(data);
          } else {
            message.warn("获取数据失败");
          }
        });
      } else {
        message.warn("爬取失败");
      }
    });
  };

  const getOption: () => echarts.EChartOption = () => {
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      times.push(i);
      const item = data[i];
      item.forEach((innerItem) => {
        const { title, count } = innerItem;
        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title]
          ? tempData[title].push(count)
          : (tempData[title] = [count]);
      });
    }

    const result: echarts.EChartOption.Series[] = [];

    for (let i in tempData) {
      result.push({
        name: i,
        type: "line",
        data: tempData[i],
      });
    }

    console.log(result);

    return {
      title: {
        text: "课程在线学习人数",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: courseNames,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: "value",
      },
      series: result,
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }
  if (isLogin) {
    return (
      <div className="home-page">
        <div className="buttons">
          <Button type="primary" onClick={handleCrawlerClick}>
            爬取
          </Button>
          <Button type="primary">展示</Button>
          <Button type="primary" onClick={handleLogoutClick}>
            退出
          </Button>
        </div>
        <ReactEcharts option={getOption()} />
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default Home;

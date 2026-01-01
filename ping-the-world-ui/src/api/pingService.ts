import axios from "axios";

const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com"; 

export type HeatmapResponse = {
  heatmap: Record<string, "green" | "yellow" | "orange" | "red">;
  timestamp: string;
};


export const fetchHeatmap = async (): Promise<HeatmapResponse> => {
  const res = await axios.get(`${BASE_URL}/ping-world/heatmap`);
  return res.data;
};

export const fetchAggregate  = () => axios.get(`${BASE_URL}/ping-world/aggregate`).then(res => res.data);
export const fetchStability  = () => axios.get(`${BASE_URL}/ping-world/stability`).then(res => res.data);
export const fetchTimeseries = () => axios.get(`${BASE_URL}/ping-world/timeseries`).then(res => res.data);

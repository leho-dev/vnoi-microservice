import http from "k6/http";
import { sleep } from "k6";

// Change the base URL to the staging server
const _BASE_URL = "https://vnoi-server-staging.undefine.tech/";

export const options = {
  cloud: {
    projectID: 3703657,
    name: "LOAD TESTING"
  },
  vus: 100,
  duration: "30s"
};

export default function () {
  http.get(_BASE_URL);
  sleep(1);
}

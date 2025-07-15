import React from "react";
import ReactDOM from "react-dom/client";

import { create_root_element } from "./common";

import "daisyui";
import "tailwindcss";

import './common.css';

ReactDOM.createRoot(document.body.appendChild(create_root_element())).render(
	<React.StrictMode>
	</React.StrictMode>
);

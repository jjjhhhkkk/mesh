package com.joon.mess.main.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class TestController {

	@RequestMapping(value="/")
	public String welcome() {
		return "dashboard_3.html";
	}
}

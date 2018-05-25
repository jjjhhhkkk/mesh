package com.joon.mess.main.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HTMLController {
	@RequestMapping(value="/abc", method= RequestMethod.GET)
	public String main() {
		
		return "/WEB-INF/sample/dashboard_3.html";
	}
}

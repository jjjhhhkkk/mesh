package com.joon.mess.main.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HTMLController {
	@RequestMapping(value="/bitna", method= RequestMethod.GET)
	public String main() {
		
		return "angularJS-1.html";
	}
}

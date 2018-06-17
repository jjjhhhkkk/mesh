package com.joon.mess.main.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.joon.mess.main.model.User;
import com.joon.mess.main.model.User.User2;

@RestController
public class Angular {

	@RequestMapping(value="/json",method=RequestMethod.GET)
	public  ResponseEntity<User> main() {
		
		User user = new User();
		User2 user2 = new User2();
		
		user2.setName("bitna");
		user2.setId("891218");
		
		user.setUser2(user2);
		
		return new ResponseEntity<User>(user,HttpStatus.OK);

	}
}

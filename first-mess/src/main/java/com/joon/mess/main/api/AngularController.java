package com.joon.mess.main.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.joon.mess.main.model.Users;
import com.joon.mess.main.model.Users.User2;

@RestController
public class AngularController {

	@RequestMapping(value="/json",method=RequestMethod.GET)
	public  ResponseEntity<Users> main() {
		
		Users users = new Users();
		User2 user2 = new User2();
		
		user2.setName("bitna");
		user2.setId("891218");
		
		users.setUser2(user2);
		
		return new ResponseEntity<Users>(users,HttpStatus.OK);

	}
}

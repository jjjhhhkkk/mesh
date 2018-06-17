package com.joon.mess.main.model;


public class User {

	private User2 user2;
	

	public User2 getUser2() {
		return user2;
	}


	public void setUser2(User2 user2) {
		this.user2 = user2;
	}


	public static class User2{
		private String name;
		private String id;
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
	
	}
	
	
}

package com.joon.mess.main.api.config.swagger;

import java.util.ArrayList;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {                                    
    @Bean
    public Docket api() { 
        return new Docket(DocumentationType.SWAGGER_2)  
          .select()                                  
          .apis(RequestHandlerSelectors.basePackage("com.joon.mess.main.api"))              
          .paths(PathSelectors.any())                          
          .build();                                           
    }
    private ArrayList<ResponseMessage> getArrayList(){
        ArrayList<ResponseMessage> lists = new ArrayList<ResponseMessage>();
         
        lists.add(new ResponseMessageBuilder().code(500).message("서버에러").responseModel(new ModelRef("Error")).build());
        lists.add(new ResponseMessageBuilder().code(403).message("권한없음").responseModel(new ModelRef("Forbbiden")).build());
         
        return lists;
    }

	
    private ApiInfo apiInfo() {
        return new ApiInfo(
          "Hello REST API",
          "Some custom description of API.",
          "API TOS",
          "Terms of service",
          new Contact("joonhyun", "www.example.com", "myeaddress@company.com"),
          "License of API", "API license URL", Collections.emptyList());
   }


}
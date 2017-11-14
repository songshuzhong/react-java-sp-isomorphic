/*
 * 文件名：numberOfCarController.java
 * 版权：Copyright by bonc
 * 描述：
 * 修改人：zhoutao
 * 修改时间：2016年8月10日
 * 跟踪单号：
 * 修改单号：
 * 修改内容：
 */

package com.bonc.epm.ui.action;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Simple {

	@RequestMapping(value = "/", produces="text/html")
	public String login(HttpServletRequest request, Model model){
        model.addAttribute("key1234", "value12312");
		return "index";
	}
	
	@RequestMapping(value = {"/jsp"})
    public String jsp(Model model) {
        model.addAttribute("key", "value");
        return "index";
    }

    @RequestMapping(value = "/jsx", produces="text/html")
    public void jsx(Model model) {
        model.addAttribute("key", "value");
    }

    @RequestMapping(value = "/jsx/page", produces="text/html")
    public String jsxp() {
        Map map = new HashMap();
        map.put("key", "value");
        return "react";
    }

    @ResponseBody
    @RequestMapping(value = "/rest/api", method = RequestMethod.GET, produces="application/json")
    public Map restful(HttpServletResponse response) {
        Map map = new HashMap();
        map.put("key1", "value1");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/jsx/rest/api", method = RequestMethod.GET, produces="application/json")
    public Map reactRestful() {
        Map map = new HashMap();
        map.put("key1", "value1");
        return map;
    }
}

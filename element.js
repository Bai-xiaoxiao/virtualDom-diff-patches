//大致虚拟dom的对象展示
// type: 指定元素的标签类型，如'li', 'div', 'a'等
// props: 表示指定元素身上的属性，如class, style, 自定义属性等
// children: 表示指定元素是否有子节点，参数以数组的形式传入
let obj = {
	type: 'ul',
	props: {
		class:'list'
	},
	children: [{
			type: 'li',
			props:{
				class:'item'
			},
			children:'周杰伦'
		},
		{
			type: 'li',
			props:{
				class:'item'
			},
			children:'林俊杰'
		},
		{
			type: 'li',
			props:{
				class:'item'
			},
			children:'王力宏'
		}
	]
}

//构造函数
class Element {
	constructor(type, props, children) {
		this.type = type;
		this.props = props;
		this.children = children;
	}
}

//批量创建构造函数
function createElement(type,props,children){
	return new Element(type,props,children);
}

//那么，虚拟dom的对象生成好了，将其渲染成真实的dom
function render(domObj){
	// 根据元素类型来创建dom
	let el = document.createElement(domObj.type);
	
	// 遍历props对象，然后给创建的元素el设置属性
	for (let key in domObj.props) {
		// 设置属性的方法
		setAttr(el,key,domObj.props[key]);
	}
	
	// 遍历子节点数组
	domObj.children.forEach(child =>{
		// 需要注意的是：如果child是虚拟dom，就继续递归渲染
		if(child instanceof Element){
			child = render(child);
		}else{
			// 只是普通的文本内容
			child = document.createTextNode(child);
		}
		// 添加到父节点
		el.appendChild(child);
	});
	
	return el;
}

// 上面用到的设置属性
function setAttr(node,key,value){
	// 需要判断key是什么
	switch(key){
		case 'value':
			if(node.tagName.toLowerCase() === 'input' ||
				node.tagName.toLowerCase() == 'textarea'){
				node.value = value;
			}else{
				node.setAttribute(key,value);
			}
			break;
		case 'style':
			node.style.cssText = value;
			break;
		default:
			node.setAttribute(key,value);
			break;
	}
}

// 将元素插入页面
function renderDom(el,target){
	target.appendChild(el);
}

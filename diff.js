// 比较新老虚拟dom，返回一个补丁对象，记录了虚拟dom的变化
function diff(oldTree,newTree){
	// 这个对象用来存放改变的补丁
	let patches = {};
	
	// 第一次比较
	let diffIndex = 0;
	
	// 递归树，比较两棵树的结果，然后放到补丁对象
	walk(oldTree,newTree,diffIndex,patches);
	
	return patches;
}


// 新的DOM节点不存在{type: 'REMOVE', index}
// 文本的变化{type: 'TEXT', text: 1}
// 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包{type: 'ATTR', attr: {class: 'list-group'}}
// 节点类型不相同，直接采用替换模式{type: 'REPLACE', newNode}
function walk(oldNode,newNode,index,patches,){
	// 每个元素都有一个补丁
	let current = [];
	
	if(!newNode){
		// 没有新节点
		current.push({type:'REMOVE',index});
	} else if(!oldNode){
		// 新增节点
		current.push({type:'ADD',newNode});
	} else if(isString(oldNode) && isString(newNode)){
		// 新老节点都是文本，判断是否有文本变化
		oldNode !== newNode && current.push({type:'TEXT',text:newNode})
	}else if(oldNode.type === newNode.type){
		// 节点类型没有变化
		// 对比属性修改
		let attr = diffAttr(oldNode.props,newNode.props);
		
		if(Object.keys(attr).length > 0){
			// 发现属性有变化
			current.push({type:'ATTR',attr})
		}
		
		// 如果有子节点，遍历子节点
		diffChildren(oldNode.children,newNode.children,patches);
	}else{
		// 节点被替换
		current.push({type:'REPLACE',newNode});
	}
	
	// 当前元素存在补丁
	if(current.length){
		patches[index] = current;
	}
}

function isString(obj) {
    return typeof obj === 'string';
}

function diffAttr(oldAttrs,newAttrs){
	let patches = {};
	
	// 比较属性
	// 是否减少属性或者修改属性
	for (let key in oldAttrs) {
		if(oldAttrs[key] !== newAttrs[key]){
			patches[key] = newAttrs[key]
		}
	}
	
	// 新增属性的补丁
	for (let key in newAttrs) {
		if(oldAttrs.hasOwnProperty(newAttrs[key])){
			patches[key] = newAttrs[key]
		}
	}
	
	return patches;
}

// 所有都基于一个序号来实现
let num = 0;

function diffChildren(oldChildren, newChildren, patches){

	// 遍历old
	oldChildren.forEach((child,index) =>{
		walk(child,newChildren[index],++num,patches);
	});
	
	// 查看是否存在新增
	let newLen = newChildren.length,
	oldLen = oldChildren.length;
	if(newLen > oldLen){
		for (let i = 0; i < newLen; i++) {
			if(i >= oldLen){
				walk('',newChildren[i],++num,patches);
			}
		}
	}
	
}
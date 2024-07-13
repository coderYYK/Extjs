
function sendPage(page){
	with(document.forms[0]){
		switch (page){
			//first
			case "F":
				thisPage.value=1;
				break    
			case "-1":
			case "1":
				//if first page located
				if(thisPage.value==null||thisPage.value=="") thisPage.value = 1;
				var t=thisPage.value;
				thisPage.value=t-0+parseInt(page);
			
				//if last page located
				if(parseInt(thisPage.value)>parseInt(maxPage.value)){
					pageSize.value=lastPageSize.value;						
				}
			
				break
			//last
			case "L":
				thisPage.value=maxPage.value;
				pageSize.value=lastPageSize.value;
				break					
			//first        
			default:
				thisPage.value=1;
		}
		document.forms[0].action=document.forms[0].action+"?changepage=1"
		document.forms[0].submit();
		document.forms[0].disabled=true;
	}
}

function init_buttions() {
 		//init button visibility
 		//when current page is less than first page, disable previous;
		if(document.forms[0].thisPage.value=="1"){
			document.all.previous.disabled=true;
			document.all.first.disabled=true;
		}
		
		//when current page is bigger than last page, disable next;
		if(parseInt(document.forms[0].thisPage.value)>=parseInt(document.forms[0].maxPage.value)){
			document.all.next.disabled=true;
			document.all.last.disabled=true;
		}
		
		if(parseInt(document.forms[0].maxPage.value)==1){
			document.all.previous.disabled=true;
			document.all.first.disabled=true;
			document.all.next.disabled=true;
			document.all.last.disabled=true;
		}

} 


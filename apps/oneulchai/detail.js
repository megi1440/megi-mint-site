document.documentElement.classList.add("js");
(function(){
  var header=document.querySelector(".site-header");
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function updateHeader(){if(header)header.classList.toggle("is-scrolled",window.scrollY>10)}
  var reveals=document.querySelectorAll(".oc-reveal");
  if(reduced||!("IntersectionObserver" in window)){reveals.forEach(function(el){el.classList.add("is-visible")})}else{
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}})},{rootMargin:"0px 0px -6% 0px",threshold:.06});
    reveals.forEach(function(el){observer.observe(el)});
  }

  document.querySelectorAll("[data-demo]").forEach(function(demo){
    demo.addEventListener("click",function(e){
      var score=e.target.closest(".oc-score-row button,.oc-icon-score-row button");
      if(score){var row=score.parentNode;row.querySelectorAll("button").forEach(function(b){b.classList.remove("is-active")});score.classList.add("is-active");var value=score.closest(".oc-score-card").querySelector(".oc-score-value");if(value)value.textContent=score.getAttribute("data-score")+" / 5";return}
      var tag=e.target.closest(".oc-demo-tags button,.oc-review-tags button");if(tag)tag.classList.toggle("is-active");
    });
  });
  document.querySelectorAll(".oc-chip").forEach(function(btn){btn.addEventListener("click",function(){btn.classList.toggle("is-active")})});

  function refreshDayflowCompare(demo){
    var side=demo.getAttribute("data-side");
    if(!side)return;
    demo.querySelectorAll(".oc-score-card[data-metric]").forEach(function(card){
      var metric=card.getAttribute("data-metric");
      var active=card.querySelector(".oc-score-row button.is-active,.oc-icon-score-row button.is-active");
      var target=document.querySelector('.oc-dayflow-compare-item[data-metric="'+metric+'"] .oc-compare-'+side);
      if(active&&target)target.textContent=active.getAttribute("data-score");
    });
  }
  document.querySelectorAll(".oc-dayflow-demo").forEach(function(demo){
    demo.addEventListener("click",function(e){
      if(e.target.closest(".oc-score-row button,.oc-icon-score-row button")){
        refreshDayflowCompare(demo);
      }
    });
  });


  var historyNow=new Date();
  var historyYear=historyNow.getFullYear();
  var historyMonthIndex=historyNow.getMonth();
  var historyMonth=historyMonthIndex+1;
  var historyToday=historyNow.getDate();
  var historyDaysInMonth=new Date(historyYear,historyMonthIndex+1,0).getDate();
  var historyFirstDay=new Date(historyYear,historyMonthIndex,1).getDay();
  function tr(key,fallback){return window.MEGI_MINT_I18N?window.MEGI_MINT_I18N.t("oneul."+key,fallback):fallback}
  function trf(key,params,fallback){
    return tr(key,fallback).replace(/\{(\w+)\}/g,function(match,name){return Object.prototype.hasOwnProperty.call(params,name)?String(params[name]):match});
  }
  function dayCount(n){return trf("history.countDays",{n:n},n+"일")}
  function reportDays(n){return trf("report.days",{n:n},n+"일")}
  function weekdayName(day,full){return tr("history.weekday."+(full?"full":"short")+"."+day,dayNames[day])}
  var dayNames=["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];

  var historySamples=[
    {line:"생각보다 훨씬 가볍게 풀린 하루였다.",msg:"걱정보다 실제 하루가 가벼웠어요. 잘 풀린 이유를 한 가지 기억해 두어도 좋아요.",tags:["업무","마음","일정"],difference:"예상과 실제의 차이가 다음 예상을 더 선명하게 만들어줘요.",card:["정의","정방향","../img/apps/oneulchai/detail/tarot_major_11_justice.webp",false]},
    {line:"계획보다 체력이 빨리 떨어졌다.",msg:"예상보다 힘이 빨리 빠진 날이에요. 다음에는 일정 사이에 쉬는 틈을 조금 더 남겨보세요.",tags:["피곤","업무","수면"],difference:"하루의 흐름과 부담이 예상과 다르게 움직였어요.",card:["컵 9","역방향","../img/apps/oneulchai/detail/tarot_cups_09.webp",true]},
    {line:"걱정했던 것보다 일이 잘 풀렸다.",msg:"시작 전 걱정과 실제 하루가 꽤 달랐어요. 생각보다 잘 해낸 부분을 가볍게 인정해 주세요.",tags:["회의","업무","마음"],difference:"예상보다 하루와 에너지는 높고, 스트레스는 더 낮았어요.",card:["소드 6","정방향","../img/apps/oneulchai/detail/tarot_swords_06.webp",false]},
    {line:"욕심을 조금 줄였으면 더 편했을 것 같다.",msg:"기대만큼은 아니었지만 그 차이도 다음 예상을 위한 기록이 돼요.",tags:["일정","피곤","마음"],difference:"기대와 실제 사이에 작은 어긋남이 있었어요.",card:["펜타클 3","정방향","../img/apps/oneulchai/detail/tarot_pentacles_03.webp",false]},
    {line:"별 기대 없었는데 꽤 기분 좋은 하루였다.",msg:"평범할 거라 생각한 날에 의외의 여유가 있었어요. 무엇이 달랐는지 떠올려보세요.",tags:["마음","수면","사람"],difference:"예상보다 하루와 에너지가 높고, 스트레스는 낮았어요.",card:["마법사","정방향","../img/apps/oneulchai/detail/tarot_major_01_magician.webp",false]},
    {line:"오후부터 생각보다 에너지가 크게 올라왔다.",msg:"처음 예상보다 훨씬 탄력 있게 흘러간 하루예요. 에너지가 오른 계기를 기억해 두세요.",tags:["업무","운동","마음"],difference:"하루와 에너지는 올라가고, 부담은 예상보다 낮았어요.",card:["완드 10","정방향","../img/apps/oneulchai/detail/tarot_wands_10.webp",false]},
    {line:"무난할 줄 알았는데 생각보다 신경 쓸 일이 많았다.",msg:"예상보다 부담이 컸던 날이에요. 반복되는 상황인지 기록 속에서 다시 살펴볼 수 있어요.",tags:["회의","업무","스트레스"],difference:"예상과 실제가 반대로 움직인 항목이 눈에 띄어요.",card:["바보","역방향","../img/apps/oneulchai/detail/tarot_major_00_fool.webp",true]}
  ];

  function setText(sel,text){var el=document.querySelector(sel);if(el)el.textContent=text}
  function scoreIcon(type,value){var v=(value==="-"||!value)?3:value;return "../img/apps/oneulchai/detail/ic_"+type+"_"+v+".png"}
  function clampScore(v){return Math.max(1,Math.min(5,v))}
  function calendarRecord(day){
    var exp=((day*2+historyMonthIndex+historyYear)%5)+1;
    var act=((day*3+historyMonthIndex*2+historyYear)%5)+1;
    var mode="both";
    if(day%17===0)mode="none";
    else if(day%13===0)mode="review";
    else if(day%10===0)mode="predict";
    if(day===historyToday){mode="both";exp=3;act=5}
    return{
      exp:mode==="review"||mode==="none"?"-":exp,
      act:mode==="predict"||mode==="none"?"-":act,
      mode:mode
    };
  }
  function historyDetail(day,rec){
    var sample=historySamples[(day+historyMonthIndex)%historySamples.length];
    var ep=rec.exp==="-"?3:+rec.exp;
    var ap=rec.act==="-"?ep:+rec.act;
    var energyExp=rec.exp==="-"?"-":clampScore(((day+historyMonthIndex)%5)+1);
    var energyAct=rec.act==="-"?"-":clampScore((((day*2)+historyMonthIndex+1)%5)+1);
    var stressExp=rec.exp==="-"?"-":clampScore(6-ep);
    var stressAct=rec.act==="-"?"-":clampScore(6-ap);
    if(day===historyToday){energyExp=2;energyAct=4;stressExp=4;stressAct=2}
    var sampleIndex=(day+historyMonthIndex)%historySamples.length;
    var sampleKey="history.sample."+sampleIndex+".";
    var cardDirection=sample.card[3]?"reversed":"upright";
    return{
      c:[rec.exp,rec.act],
      e:[energyExp,energyAct],
      s:[stressExp,stressAct],
      line:tr(sampleKey+"line",sample.line),
      msg:tr(sampleKey+"msg",sample.msg),
      tags:tr(sampleKey+"tags",sample.tags.join("|")).split("|"),
      difference:tr(sampleKey+"difference",sample.difference),
      card:[tr(sampleKey+"card",sample.card[0]),tr("history.direction."+cardDirection,sample.card[1]),sample.card[2],sample.card[3]]
    };
  }
  function historyState(rec){
    if(rec.exp!=="-"&&rec.act!=="-")return tr("history.stateBoth","예상 · 돌아보기");
    if(rec.exp!=="-")return tr("history.predictionOnly","예상만 기록");
    if(rec.act!=="-")return tr("history.reflectionOnly","돌아보기만 기록");
    return tr("history.noEntry","기록 없음");
  }
  function historyTip(rec){
    if(rec.exp!=="-"&&rec.act!=="-")return trf("history.tipBoth",{exp:rec.exp,act:rec.act},"예상 {exp} → 실제 {act}");
    if(rec.exp!=="-")return trf("history.tipPredict",{exp:rec.exp},"예상 {exp} · 돌아보기 없음");
    if(rec.act!=="-")return trf("history.tipReview",{act:rec.act},"예상 없음 · 실제 {act}");
    return tr("history.noEntry","기록 없음");
  }
  function escapeHtml(value){return String(value).replace(/[&<>"]/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch]})}
  function renderHistoryCalendar(){
    var cal=document.querySelector(".oc-history-calendar-v4 .oc-history-calendar-grid");
    if(!cal)return;

    var previous=cal.querySelector("button.is-selected[data-day]");
    var selectedDay=previous?previous.getAttribute("data-day"):String(historyToday);
    setText(".oc-history-month-title",trf("history.monthTitle",{year:historyYear,month:historyMonth},"{year}년 {month}월"));
    setText(".oc-history-current-date",trf("history.todayDate",{month:historyMonth,day:historyToday},"오늘 {month}월 {day}일"));
    cal.setAttribute("aria-label",trf("history.calendarAria",{year:historyYear,month:historyMonth},"{year}년 {month}월 기록 예시"));

    var html="";
    for(var blank=0;blank<historyFirstDay;blank++)html+='<button class="is-empty" type="button" tabindex="-1" aria-hidden="true"></button>';

    var predictCount=0,reviewCount=0,bothCount=0,recordedCount=0;
    for(var day=1;day<=historyDaysInMonth;day++){
      var rec=calendarRecord(day);
      if(rec.exp!=="-")predictCount++;
      if(rec.act!=="-")reviewCount++;
      if(rec.exp!=="-"&&rec.act!=="-")bothCount++;
      if(rec.exp!=="-"||rec.act!=="-")recordedCount++;

      var classes=[];
      if(day===historyToday)classes.push("is-today","is-selected");
      var dots="";
      if(rec.exp!=="-")dots+='<i class="mint"></i>';
      if(rec.act!=="-")dots+='<i class="peach"></i>';
      var todayMark=day===historyToday?'<span class="oc-history-today-mark">'+escapeHtml(tr("history.today","오늘"))+'</span>':"";
      html+='<button type="button" class="'+classes.join(" ")+'" data-day="'+day+'" data-exp="'+rec.exp+'" data-act="'+rec.act+'" data-tip="'+historyTip(rec)+'"><b>'+day+'</b>'+todayMark+(dots?'<em>'+dots+'</em>':"")+'</button>';
    }
    cal.innerHTML=html;

    var density=Math.round(recordedCount/historyDaysInMonth*100);
    setText(".oc-history-count-predict",dayCount(predictCount));
    setText(".oc-history-count-review",dayCount(reviewCount));
    setText(".oc-history-count-both",dayCount(bothCount));
    setText(".oc-history-density-value",density+"%");
    var bar=document.querySelector(".oc-history-density i b");if(bar)bar.style.width=density+"%";

    renderHistoryRecent();
    bindHistoryCalendar();

    var selected=cal.querySelector('button[data-day="'+selectedDay+'"]')||cal.querySelector("button[data-day]");
    if(selected){
      cal.querySelectorAll("button.is-selected").forEach(function(x){x.classList.remove("is-selected")});
      selected.classList.add("is-selected");
      showHistory(selected);
    }
  }
  function renderHistoryRecent(){
    var strip=document.querySelector(".oc-history-strip-v4");
    if(!strip)return;
    var count=Math.min(6,historyDaysInMonth);
    var start=Math.max(1,Math.min(historyToday-2,historyDaysInMonth-count+1));
    var html="";
    for(var day=start;day<start+count;day++){
      var rec=calendarRecord(day);
      var delta=(rec.exp!=="-"&&rec.act!=="-")?(+rec.act-+rec.exp):null;
      var summary=rec.exp!=="-"&&rec.act!=="-"?trf("history.recentBoth",{exp:rec.exp,act:rec.act},"{exp} → {act}"):rec.exp!=="-"?trf("history.recentPredict",{exp:rec.exp},"예상 {exp}"):rec.act!=="-"?trf("history.recentReview",{act:rec.act},"실제 {act}"):tr("history.noEntry","기록 없음");
      var deltaText=delta===null?"—":delta>0?"+"+delta:String(delta);
      html+='<button type="button" '+(day===historyToday?'class="is-active" ':'')+'data-history-day="'+day+'"><small>'+historyMonth+'/'+day+'</small><b>'+summary+'</b><em>'+deltaText+'</em></button>';
    }
    strip.innerHTML=html;
  }
  function bindHistoryCalendar(){
    var cal=document.querySelector(".oc-history-calendar-v4 .oc-history-calendar-grid");
    if(cal&&!cal.dataset.bound){
      cal.dataset.bound="1";
      cal.addEventListener("click",function(e){
        var b=e.target.closest("button[data-day]");if(!b)return;
        cal.querySelectorAll("button").forEach(function(x){x.classList.remove("is-selected")});
        b.classList.add("is-selected");
        showHistory(b);
      });
    }
    var strip=document.querySelector(".oc-history-strip-v4");
    if(strip&&!strip.dataset.bound){
      strip.dataset.bound="1";
      strip.addEventListener("click",function(e){
        var b=e.target.closest("button[data-history-day]");if(!b||!cal)return;
        var target=cal.querySelector('button[data-day="'+b.getAttribute("data-history-day")+'"]');
        if(target)target.click();
      });
    }
  }
  function showHistory(button){
    var day=+button.getAttribute("data-day");
    var rec={exp:button.getAttribute("data-exp")||"-",act:button.getAttribute("data-act")||"-"};
    var d=historyDetail(day,rec);
    var detail=document.querySelector(".oc-history-detail-v4");
    if(detail){detail.classList.remove("is-refreshing");void detail.offsetWidth;detail.classList.add("is-refreshing")}

    setText(".oc-history-date",trf("history.dateDetail",{month:historyMonth,day:day,weekday:weekdayName(new Date(historyYear,historyMonthIndex,day).getDay(),true)},"{month}월 {day}일 {weekday}"));
    setText(".oc-history-exp",rec.exp);
    setText(".oc-history-act",rec.act);
    setText(".oc-history-state",historyState(rec));

    var delta=(rec.exp!=="-"&&rec.act!=="-")?(+rec.act-+rec.exp):null;
    var deltaEl=document.querySelector(".oc-history-delta");
    if(deltaEl){
      deltaEl.textContent=delta===null?"—":delta>0?"+"+delta:String(delta);
      deltaEl.classList.toggle("is-up",delta!==null&&delta>0);
      deltaEl.classList.toggle("is-down",delta!==null&&delta<0);
      deltaEl.classList.toggle("is-same",delta===0);
    }

    setText(".oc-history-condition-exp",d.c[0]);setText(".oc-history-condition-act",d.c[1]);
    setText(".oc-history-energy-exp",d.e[0]);setText(".oc-history-energy-act",d.e[1]);
    setText(".oc-history-stress-exp",d.s[0]);setText(".oc-history-stress-act",d.s[1]);
    setText(".oc-history-line",d.line);
    setText(".oc-history-message-text",d.msg);
    setText(".oc-history-difference-copy",rec.exp==="-"&&rec.act==="-"?tr("history.noRecordDifference","기록이 없는 날도 달력의 흐름 속에서 자연스럽게 남겨둘 수 있어요."):d.difference);
    setText(".oc-history-card-title",d.card[0]);
    setText(".oc-history-card-direction",d.card[1]);

    var imgs=document.querySelectorAll(".oc-history-score-list img");
    if(imgs.length>=3){
      imgs[0].src=scoreIcon("condition",d.c[1]!=="-"?d.c[1]:d.c[0]);
      imgs[1].src=scoreIcon("energy",d.e[1]!=="-"?d.e[1]:d.e[0]);
      imgs[2].src=scoreIcon("stress",d.s[1]!=="-"?d.s[1]:d.s[0]);
    }
    var tags=document.querySelector(".oc-history-tags-v4");
    if(tags)tags.innerHTML=d.tags.map(function(t){return"<span>"+escapeHtml(t)+"</span>"}).join("");

    var img=document.querySelector(".oc-history-card-image");
    if(img){img.src=d.card[2];img.alt=d.card[0]+" "+d.card[1];img.classList.toggle("is-reversed",!!d.card[3])}

    document.querySelectorAll(".oc-history-strip-v4 button").forEach(function(b){
      b.classList.toggle("is-active",+b.getAttribute("data-history-day")===day);
    });
  }

  renderHistoryCalendar();

  var patternMetricData={
    condition:{
      predict:[3.0,3.1,3.0,3.2,3.1,3.3,3.2,3.3,3.2,3.4,3.3,3.2,3.0],
      actual:[3.1,3.3,3.2,3.4,3.3,3.5,3.4,3.3,3.5,3.4,3.6,3.5,5.0],
      summary:"마지막 기록 · 예상 3 → 실제 5"
    },
    energy:{
      predict:[2.2,2.4,2.5,2.8,2.7,2.9,3.0,2.8,3.1,3.0,3.2,3.1,3.0],
      actual:[2.0,2.6,2.4,3.0,2.8,3.3,3.1,3.4,3.2,3.5,3.4,3.6,4.0],
      summary:"마지막 기록 · 예상 3 → 실제 4"
    },
    stress:{
      predict:[3.8,3.6,3.7,3.5,3.6,3.4,3.5,3.3,3.4,3.2,3.3,3.1,4.0],
      actual:[3.7,3.5,3.6,3.2,3.5,3.3,3.1,3.4,3.0,3.2,2.9,3.0,2.0],
      summary:"마지막 기록 · 예상 4 → 실제 2"
    }
  };

  var patternPeriods={
    "7":{predict:6,review:6,compare:5,up:2,same:2,down:1,density:86},
    "30":{predict:24,review:21,compare:18,up:6,same:9,down:3,density:90},
    "90":{predict:72,review:66,compare:58,up:19,same:28,down:11,density:80},
    "180":{predict:143,review:132,compare:118,up:37,same:59,down:22,density:79},
    "365":{predict:289,review:254,compare:217,up:60,same:108,down:49,density:79}
  };

  function patternPad(n){return String(n).padStart(2,"0")}
  function patternDateText(date){return date.getFullYear()+"."+patternPad(date.getMonth()+1)+"."+patternPad(date.getDate())}
  function patternRange(days){
    var end=new Date();
    var start=new Date(end.getFullYear(),end.getMonth(),end.getDate()-(days-1));
    return patternDateText(start)+" ~ "+patternDateText(end);
  }
  function patternPoints(values){
    var width=640,step=width/(values.length-1);
    return values.map(function(v,i){
      var x=20+(i*step);
      var y=225-((v-1)/4*200);
      return x.toFixed(1)+","+y.toFixed(1);
    }).join(" ");
  }
  function renderPatternChart(metric){
    var data=patternMetricData[metric]||patternMetricData.condition;
    var p=document.querySelector(".oc-pattern-line--predict");
    var a=document.querySelector(".oc-pattern-line--actual");
    if(p)p.setAttribute("points",patternPoints(data.predict));
    if(a)a.setAttribute("points",patternPoints(data.actual));
    setText(".oc-chart-summary",trf("report.lastSummary",{exp:data.predict[data.predict.length-1],act:data.actual[data.actual.length-1]},data.summary));

    var group=document.querySelector(".oc-pattern-chart-points");
    if(group){
      group.innerHTML="";
      data.actual.forEach(function(v,i){
        var width=640,step=width/(data.actual.length-1);
        var x=20+(i*step),y=225-((v-1)/4*200);
        var c=document.createElementNS("http://www.w3.org/2000/svg","circle");
        c.setAttribute("cx",x.toFixed(1));c.setAttribute("cy",y.toFixed(1));c.setAttribute("r",i===data.actual.length-1?"6":"4");
        c.setAttribute("fill","#b9795e");
        c.setAttribute("data-tip",trf("report.chartTip",{value:v.toFixed(1)},"실제 {value}"));
        group.appendChild(c);
      });
    }
    bindPatternChartTips();
  }
  function bindPatternChartTips(){
    var host=document.querySelector(".oc-pattern-chart");
    var tip=document.querySelector(".oc-pattern-chart-tooltip");
    if(!host||!tip)return;
    host.querySelectorAll("circle[data-tip]").forEach(function(c){
      c.onmouseenter=function(){
        var hb=host.getBoundingClientRect(),cb=c.getBoundingClientRect();
        tip.textContent=c.getAttribute("data-tip");
        tip.style.left=(cb.left-hb.left+cb.width/2)+"px";
        tip.style.top=(cb.top-hb.top)+"px";
        tip.classList.add("is-visible");
      };
      c.onmouseleave=function(){tip.classList.remove("is-visible")};
    });
  }
  function renderPatternDensity(rate,days){
    var wrap=document.querySelector(".oc-density-v4");
    if(!wrap)return;
    var total=35,filled=Math.round(total*rate/100),html="";
    for(var i=0;i<total;i++){
      var active=i<filled;
      var op=active?(0.38+(((i*7+days)%7)/10)):0.10;
      html+='<i style="--o:'+Math.min(op,.95).toFixed(2)+'"></i>';
    }
    wrap.innerHTML=html;
  }
  function renderHabitMatrix(){
    var wrap=document.querySelector(".oc-habit-cells");
    if(!wrap)return;
    var vals=[
      5,3,2,1,0,
      3,7,5,2,1,
      2,5,12,6,2,
      1,2,7,12,7,
      0,1,2,7,24
    ],max=Math.max.apply(null,vals);
    wrap.innerHTML=vals.map(function(v,i){
      var row=Math.floor(i/5)+1,col=(i%5)+1,op=.10+(v/max*.72);
      var top=v===max?" is-top":"";
      return '<button type="button" class="'+top+'" style="--o:'+op.toFixed(2)+'" title="'+escapeHtml(trf("report.habitTip",{exp:row,act:col,count:v},"예상 {exp} → 실제 {act} · {count}회"))+'"></button>';
    }).join("");
  }
  function applyPatternPeriod(days){
    var data=patternPeriods[String(days)]||patternPeriods["30"];
    setText(".oc-period-range",patternRange(+days));
    setText(".oc-period-predict",reportDays(data.predict));
    setText(".oc-period-review",reportDays(data.review));
    setText(".oc-period-compare",reportDays(data.compare));
    setText(".oc-period-compare-short",reportDays(data.compare));
    setText(".oc-flow-up",reportDays(data.up));
    setText(".oc-flow-same",reportDays(data.same));
    setText(".oc-flow-down",reportDays(data.down));
    setText(".oc-density-rate",data.density+"%");
    setText(".oc-density-days",trf("report.recordDays",{n:Math.max(data.predict,data.review)},"{n}일 기록"));
    setText(".oc-pattern-period-badge",days==="180"?trf("report.months",{n:6},"6개월"):days==="365"?trf("report.years",{n:1},"1년"):reportDays(days));

    var total=Math.max(1,data.up+data.same+data.down);
    var up=Math.round(data.up/total*100),same=Math.round(data.same/total*100),down=100-up-same;
    setText(".oc-diff-up",up+"%");setText(".oc-diff-same",same+"%");setText(".oc-diff-down",down+"%");
    var ub=document.querySelector(".oc-diff-up-bar"),sb=document.querySelector(".oc-diff-same-bar"),db=document.querySelector(".oc-diff-down-bar");
    if(ub)ub.style.width=up+"%";if(sb)sb.style.width=same+"%";if(db)db.style.width=down+"%";
    renderPatternDensity(data.density,+days);
  }

  var patternNow=new Date();
  function renderSurpriseDate(){setText(".oc-surprise-date-text",trf("report.surpriseDate",{month:patternNow.getMonth()+1,day:patternNow.getDate()},"{month}월 {day}일"))}
  renderSurpriseDate();
  document.querySelectorAll(".oc-period-tabs button").forEach(function(btn){
    btn.addEventListener("click",function(){
      document.querySelectorAll(".oc-period-tabs button").forEach(function(x){x.classList.remove("is-active")});
      btn.classList.add("is-active");
      applyPatternPeriod(btn.getAttribute("data-period"));
    });
  });
  document.querySelectorAll(".oc-pattern-v4 .oc-metric-tabs button").forEach(function(btn){
    btn.addEventListener("click",function(){
      var tabs=btn.parentElement;
      tabs.querySelectorAll("button").forEach(function(x){x.classList.remove("is-active")});
      btn.classList.add("is-active");
      renderPatternChart(btn.getAttribute("data-metric"));
    });
  });
  document.querySelectorAll(".oc-word-cloud-v4 button").forEach(function(btn){
    btn.addEventListener("click",function(){
      document.querySelectorAll(".oc-word-cloud-v4 button").forEach(function(x){x.classList.remove("is-active")});
      btn.classList.add("is-active");
    });
  });

  renderHabitMatrix();
  renderPatternChart("condition");
  applyPatternPeriod(30);
  window.addEventListener("megi:languagechange",function(){
    renderHistoryCalendar();
    var selectedMetric=document.querySelector(".oc-pattern-v4 .oc-metric-tabs button.is-active");
    renderPatternChart(selectedMetric?selectedMetric.getAttribute("data-metric"):"condition");
    var selectedPeriod=document.querySelector(".oc-period-tabs button.is-active");
    applyPatternPeriod(selectedPeriod?selectedPeriod.getAttribute("data-period"):"30");
    renderHabitMatrix();
    renderSurpriseDate();
  });

  var deck=[
    {id:"star",title:"별",direction:"정방향",src:"../img/apps/oneulchai/detail/tarot_major_17_star.webp",keys:["희망","회복","여유"],msg:"멀리 보려 애쓰기보다 지금 마음이 편해지는 작은 방향부터 바라보세요."},
    {id:"priestess",title:"여사제",direction:"정방향",src:"../img/apps/oneulchai/detail/tarot_major_02_high_priestess.webp",keys:["직감","고요","관찰"],msg:"답을 서둘러 정하기보다 지금 마음속에서 반복해서 떠오르는 감각을 잠깐 바라보세요."},
    {id:"sun",title:"태양",direction:"정방향",src:"../img/apps/oneulchai/detail/tarot_major_19_sun.webp",keys:["밝음","활력","확신"],msg:"오늘은 잘되고 있는 것을 먼저 바라보세요. 작은 확신이 하루의 분위기를 바꿀 수 있어요."}
  ];

  var discoveryBack="../img/apps/oneulchai/detail/tarot_back.webp";
  var discoveryCards=[].slice.call(document.querySelectorAll(".oc-discovery-v4-deck .oc-draw-card"));
  var discoveryBusy=false;
  var discoveryDrawOrder=[1,2,0];
  var slotToData=[1,0,2];
  var discoveryRevealed=[false,false,false];

  function localizedDiscoveryCard(data){
    var key="discover.card."+data.id;
    return {
      title:tr(key+".title",data.title),
      direction:tr("history.direction.upright","정방향"),
      src:data.src,
      keys:data.keys.map(function(value,index){return tr(key+".keyword"+index,value)}),
      msg:tr(key+".message",data.msg)
    };
  }

  function syncDiscoveryPhone(data){
    data=localizedDiscoveryCard(data);
    var img=document.querySelector(".oc-phone-card-image");
    if(img){
      img.src=data.src;
      img.alt=data.title+" · "+data.direction;
      img.classList.remove("is-reversed");
    }
    setText(".oc-phone-card-title",data.title);
    setText(".oc-phone-card-direction",data.direction);

    var keys=document.querySelector(".oc-phone-keywords");
    if(keys)keys.innerHTML=data.keys.map(function(k){return "<span>"+escapeHtml(k)+"</span>"}).join("");

    var msg=document.querySelector(".oc-phone-message p");
    if(msg)msg.textContent=data.msg;
  }

  function updateDiscoveryButton(){
    var drawBtn=document.querySelector(".oc-draw-button");
    if(!drawBtn)return;

    var allOpen=discoveryRevealed.every(function(v){return v});
    drawBtn.disabled=allOpen;
    drawBtn.classList.toggle("is-complete",allOpen);

    if(allOpen){
      drawBtn.innerHTML=escapeHtml(tr("discover.drawComplete","세 장 모두 만나봤어요"))+' <span>✓</span>';
    }else{
      drawBtn.innerHTML=escapeHtml(tr("discover.drawAction","오늘의 카드 뽑아보기"))+' <span>✦</span>';
    }
  }

  function flipDiscoveryCardOnce(card,newSrc,onMiddle,onDone){
    var img=card&&card.querySelector("img");
    if(!img){
      if(onMiddle)onMiddle();
      if(onDone)onDone();
      return;
    }

    img.classList.remove("is-flip-once");
    void img.offsetWidth;
    img.classList.add("is-flip-once");

    window.setTimeout(function(){
      img.src=newSrc;
      img.classList.remove("is-reversed");
      if(onMiddle)onMiddle();
    },145);

    window.setTimeout(function(){
      img.classList.remove("is-flip-once");
      if(onDone)onDone();
    },310);
  }

  function revealDiscoveryCard(slot){
    if(discoveryBusy||!discoveryCards.length)return;

    var card=discoveryCards[slot];
    var data=deck[slotToData[slot]];
    if(!card||!data)return;

    if(discoveryRevealed[slot]){
      discoveryCards.forEach(function(c){c.classList.remove("is-current")});
      card.classList.add("is-current");
      syncDiscoveryPhone(data);
      return;
    }

    discoveryBusy=true;
    discoveryCards.forEach(function(c){c.classList.remove("is-current")});
    card.classList.add("is-current","is-chosen");

    flipDiscoveryCardOnce(card,data.src,function(){
      syncDiscoveryPhone(data);
    },function(){
      discoveryRevealed[slot]=true;
      card.classList.add("is-revealed");
      discoveryBusy=false;
      updateDiscoveryButton();
    });
  }

  discoveryCards.forEach(function(card,index){
    card.addEventListener("click",function(){
      revealDiscoveryCard(index);
    });
  });

  var drawBtn=document.querySelector(".oc-draw-button");
  if(drawBtn){
    drawBtn.addEventListener("click",function(){
      if(discoveryBusy)return;

      var nextSlot=-1;
      for(var i=0;i<discoveryDrawOrder.length;i++){
        var slot=discoveryDrawOrder[i];
        if(!discoveryRevealed[slot]){
          nextSlot=slot;
          break;
        }
      }

      if(nextSlot<0){
        updateDiscoveryButton();
        return;
      }

      revealDiscoveryCard(nextSlot);
    });
  }

  discoveryCards.forEach(function(card){
    var img=card.querySelector("img");
    if(img){
      img.src=discoveryBack;
      img.classList.remove("is-reversed","is-card-flipping","is-flip-once");
    }
    card.classList.remove("is-revealed","is-chosen","is-current");
  });

  syncDiscoveryPhone(deck[0]);
  updateDiscoveryButton();

  var archiveFilterButtons=[].slice.call(document.querySelectorAll("[data-archive-filter]"));
  var archiveSuitCards=[].slice.call(document.querySelectorAll(".oc-suit-card"));

  function applyArchiveFilter(filter){
    var labels={
      all:tr("discover.filter.allLabel","전체 카드"),
      found:tr("discover.filter.foundLabel","발견한 카드"),
      missing:tr("discover.filter.missingLabel","아직 만나지 못한 카드")
    };
    setText(".oc-archive-v5-filter-label",labels[filter]||labels.all);

    archiveSuitCards.forEach(function(card){
      var found=Number(card.getAttribute("data-found"))||0;
      var total=Number(card.getAttribute("data-total"))||0;
      var value=found;
      var pct=total?Math.round(found/total*100):0;

      if(filter==="missing"){
        value=Math.max(0,total-found);
        pct=total?Math.round(value/total*100):0;
      }

      var current=card.querySelector(".oc-suit-current");
      var percent=card.querySelector(".oc-suit-percent");
      var bar=card.querySelector(".oc-suit-card-progress b");

      if(current)current.textContent=value;
      if(percent)percent.textContent=pct+"%";
      if(bar)bar.style.setProperty("--p",pct+"%");

      card.classList.toggle("is-filter-found",filter==="found");
      card.classList.toggle("is-filter-missing",filter==="missing");
    });
  }

  archiveFilterButtons.forEach(function(btn){
    btn.addEventListener("click",function(){
      archiveFilterButtons.forEach(function(x){x.classList.remove("is-active")});
      btn.classList.add("is-active");
      applyArchiveFilter(btn.getAttribute("data-archive-filter"));
    });
  });

  window.addEventListener("megi:languagechange",function(){
    // Keep the currently displayed tarot card and already revealed slots.
    var current=document.querySelector(".oc-discovery-v4-deck .oc-draw-card.is-current");
    var currentSlot=current?discoveryCards.indexOf(current):-1;
    syncDiscoveryPhone(deck[currentSlot>=0?slotToData[currentSlot]:0]);
    discoveryCards.forEach(function(card,slot){
      var img=card.querySelector("img");
      if(!img)return;
      if(discoveryRevealed[slot]){
        var chosen=localizedDiscoveryCard(deck[slotToData[slot]]);
        img.alt=chosen.title+" · "+chosen.direction;
      }else{
        img.alt=tr("discover.slot"+slot+".back",img.alt);
      }
    });
    updateDiscoveryButton();
    var activeFilter=document.querySelector("[data-archive-filter].is-active");
    applyArchiveFilter(activeFilter?activeFilter.getAttribute("data-archive-filter"):"all");
  });

  document.querySelectorAll(".oc-toggle[data-reminder]").forEach(function(toggle){toggle.addEventListener("click",function(){toggle.classList.toggle("is-on");var key=toggle.getAttribute("data-reminder"),pill=document.querySelector('[data-reminder-pill="'+key+'"]'),row=toggle.closest(".oc-reminder-row"),time=row?row.nextElementSibling:null,off=!toggle.classList.contains("is-on");if(pill)pill.classList.toggle("is-off",off);if(row)row.classList.toggle("is-off",off);if(time&&time.classList.contains("oc-reminder-time"))time.classList.toggle("is-off",off)})});

  updateHeader();window.addEventListener("scroll",updateHeader,{passive:true});
})();

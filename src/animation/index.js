// import { animate } from "framer-motion";

export const slideUpAndDown = {
    initial:{opacity:0,y:20},
    animate:{opacity:1,y:0},
    exit:{opacity:0,y:20}
}

export const fadeInOutWithOpacity = {
    initial:{opacity:0},
    animate:{opacity:1},
    exit:{opacity:0}
}

export const popInOutWithOpacity = {
    initial:{opacity:0,scale:.6, y:20},
    animate:{opacity:1,scale:1,y:0},
    exit:{opacity:0,scale:.6,y:20}
}

export const scaleInOut = (index)=>{
    return{
        initial:{opacity:0,scale:.85},
        animate:{opacity:1,scale:1},
        exit:{opacity:0,scale:.85},
        transition:{delay:index*0.3,ease:"easeInOut"},
    }
}
export const popInOutWithOpacityInXdirection = {
    initial : {opacity:0, scale:0.6,x:50},
    animate : {opacity:1,scale:1,x:0},
    exit:{opacity:0, scale:0.6, x:50}
}

export const opacityINOut = (index) => {
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { delay: index * 0.1, ease: "easeInOut" },
    };
  };
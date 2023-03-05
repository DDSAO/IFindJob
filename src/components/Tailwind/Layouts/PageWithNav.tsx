import { User } from "@/interfaces/userDefinitions";
import { setCookie } from "cookies-next";
import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from "next/router";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";
import { RiThumbUpLine } from "react-icons/ri";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { FiThumbsUp } from "react-icons/fi";
import { TiDocumentAdd } from "react-icons/ti";

const TextBar = (props: { text: string; expand: boolean | null }) => {
  const { text, expand } = props;

  const textRef = useRef(null);
  const expandContainerTimeline = useRef(null);

  useEffect(() => {
    expandContainerTimeline.current = gsap.timeline({ paused: true }).fromTo(
      textRef.current,
      {
        x: 0,
      },
      {
        x: 16 - (textRef.current as any).offsetWidth,
        duration: 0.2,
      },
      "-=0.2"
    ) as any;

    return () => {
      (expandContainerTimeline.current as any).kill();
    };
  }, []);

  useEffect(() => {
    if (expand) {
      (expandContainerTimeline.current as any).restart();
    } else if (expand === false) {
      (expandContainerTimeline.current as any).reverse();
    }
  }, [expand]);

  return (
    <div className="relative w-full h-4">
      <div className="absolute left-2 h-0.5 w-[calc(100%-16px)] bg-slate-200"></div>
      <p
        ref={textRef}
        className={`absolute top-1.5 w-full text-xs text-slate-500 text-center`}
      >
        {text}
      </p>
    </div>
  );
};

const IconBar = (props: {
  icon: any;
  text: string;
  expand: boolean | null;
  setExpand: () => void;
  onClick: () => void;
}) => {
  const { icon, text, expand, setExpand, onClick } = props;

  const hoverTextRef = useRef(null);
  const boxTextRef = useRef(null);
  const iconRef = useRef(null);

  const expandTextTimeline = useRef(null);
  const expandContainerTimeline = useRef(null);

  useEffect(() => {
    expandTextTimeline.current = gsap.timeline({ paused: true }).fromTo(
      hoverTextRef.current,
      {
        opacity: 0,
        width: "0%",
      },
      { opacity: 1, width: "100%", duration: 0.2 }
    ) as any;
    expandContainerTimeline.current = gsap
      .timeline({ paused: true })
      .to(hoverTextRef.current, { opacity: 0, duration: 0.2 })
      .fromTo(
        iconRef.current,
        {
          x: 0,
        },
        { x: -16, duration: 0.2 },
        "-=0.2"
      )
      .fromTo(
        boxTextRef.current,
        {
          opacity: 0,
          width: "0%",
        },
        { opacity: 1, width: "100%", duration: 0.2 },
        "-=0.2"
      ) as any;

    return () => {
      (expandTextTimeline.current as any).kill();
      (expandContainerTimeline.current as any).kill();
    };
  }, []);

  useEffect(() => {
    if (expand) {
      (expandContainerTimeline.current as any).restart();
    } else if (expand === false) {
      (expandTextTimeline.current as any).progress(0).pause();
      (expandContainerTimeline.current as any).reverse();
    }
  }, [expand]);

  return (
    <div
      onClick={() => {
        if (!expand) {
          setExpand();
        } else {
          onClick();
        }
      }}
      className={`relative w-full h-12 flex items-center justify-center p-4 my-2 rounded-lg group ${
        expand ? "hover:bg-white" : ""
      } duration-300`}
    >
      <div
        onMouseEnter={() => {
          if (!expand) (expandTextTimeline.current as any).restart();
        }}
        onMouseLeave={() => {
          if (!expand) (expandTextTimeline.current as any).reverse();
        }}
        ref={iconRef}
        className="absolute left-8 w-8 h-8 top-3 z-10 text-slate-500 group-hover:text-black"
      >
        {icon}
      </div>

      <div className="absolute top-1.5 left-16">
        <div ref={hoverTextRef} className="overflow-hidden opacity-0">
          <p className="whitespace-nowrap px-4 py-2 bg-blue-400 text-white rounded-full">
            {text}
          </p>
        </div>
      </div>
      <div className="absolute top-1.5 left-12">
        <div ref={boxTextRef} className="overflow-hidden opacity-0">
          <p className="cursor-pointer whitespace-nowrap px-4 py-2 text-slate-500 group-hover:text-black duration-300 rounded-full">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

const NavBar = (props: { user: User }) => {
  const [expand, setExpand] = useState<boolean | null>(null);

  const containerRef = useRef(null);
  const expandContainerTimeline = useRef(null);

  const router = useRouter();

  useEffect(() => {
    expandContainerTimeline.current = gsap.timeline({ paused: true }).fromTo(
      containerRef.current,
      {
        width: 128,
      },
      { width: 256, duration: 0.2 }
    ) as any;

    const handleClick = (event: any) => {
      if (
        containerRef.current &&
        !(containerRef.current as any).contains(event.target)
      ) {
        setExpand(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      (expandContainerTimeline.current as any).kill();
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    if (expand) {
      (expandContainerTimeline.current as any).restart();
    } else if (expand === false) {
      (expandContainerTimeline.current as any).reverse();
    }
  }, [expand]);

  return (
    <div className="absolute h-full left-0 top-0 z-10">
      <div
        onClick={() => {
          if (!expand) setExpand(true);
        }}
        ref={containerRef}
        className={`absolute w-32 h-[calc(100%-64px)] mt-8 border bg-white/30 backdrop-blur-md rounded-xl px-4 pt-12 pb-12 flex flex-col items-start justify-between`}
      >
        {expand && (
          <div
            onClick={() => {
              setExpand(false);
            }}
            className="absolute top-4 right-4 bg-white hover:bg-slate-400 hover:text-white duration-300 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <MdKeyboardArrowLeft size="16px" />
          </div>
        )}

        <div className="w-full">
          {/* <TextBar text="USER" expand={expand} /> */}

          <IconBar
            onClick={() => {
              setExpand(false);
              router.push("/");
            }}
            icon={<AiOutlineHome size="24px" />}
            text={"IFindJob"}
            expand={expand}
            setExpand={() => setExpand(true)}
          />
          <TextBar text="MENU" expand={expand} />
          <IconBar
            onClick={() => {
              router.push("/job/create");
            }}
            icon={<TiDocumentAdd size="24px" />}
            text={"Add Job"}
            expand={expand}
            setExpand={() => {
              setExpand(true);
            }}
          />
          <IconBar
            onClick={() => {
              router.push("/job/list");

              setExpand(false);
            }}
            icon={<AiOutlineUnorderedList size="24px" />}
            text={"My Jobs"}
            expand={expand}
            setExpand={() => setExpand(true)}
          />
        </div>
        <div className="w-full">
          <TextBar text="USER" expand={expand} />
          <IconBar
            onClick={() => {
              router.push("/user/");
            }}
            icon={<BiUserCircle size="24px" />}
            text={props.user.username.toUpperCase()}
            expand={expand}
            setExpand={() => setExpand(true)}
          />
          <TextBar text="LOG OUT" expand={expand} />
          <IconBar
            onClick={() => {
              setCookie("token", null);
              router.reload();
            }}
            icon={<BiLogOut size="24px" />}
            text={"Log out"}
            expand={expand}
            setExpand={() => setExpand(true)}
          />
        </div>
      </div>
    </div>
  );
};
const Content = (props: { content?: any }) => {
  return (
    <div className="absolute h-full w-[calc(100%-128px)] left-32 top-0 overflow-auto">
      {props.content ?? null}
    </div>
  );
};

const ThumbUp = () => {
  return (
    <div className="">
      <div className="absolute top-[calc(50%-192px)] left-[calc(50%-192px)] animate-ping w-96 h-96 ">
        <FiThumbsUp className="w-96 h-96 text-green-200" />
      </div>
      <div className="absolute w-96 h-96 top-[calc(50%-192px)] left-[calc(50%-192px)]">
        <FiThumbsUp className="absolute w-96 h-96 text-green-400" />
      </div>
    </div>
  );
};

export const PlayThumbUpAtom = atom({
  key: "/PlayThumbUpAtom",
  default: false,
});

export const PageWithNav = (props: { children?: any; user: User }) => {
  let { user, children } = props;
  const [thumbUp, setThumbUp] = useRecoilState(PlayThumbUpAtom);

  useEffect(() => {
    let timeout: any = null;
    if (thumbUp) {
      timeout = setTimeout(() => {
        setThumbUp(false);
      }, 1500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [thumbUp]);

  //https://dribbble.com/shots/17143561-Sidebar-Navigation-Menu-Animation
  return (
    <div className="relative w-screen h-screen bg-blue-100">
      <NavBar user={user} />
      <Content content={children} />
      {thumbUp && <ThumbUp />}
    </div>
  );
};

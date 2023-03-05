import { ButtonWithIcon } from "@/components/Tailwind/Button/ButtonWithIcon";
import { SlideButton } from "@/components/Tailwind/Button/SlideButton";
import { TextField } from "@/components/Tailwind/Input/TextField";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineAlignLeft, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineLogin } from "react-icons/md";
import { BiBarcode, BiError } from "react-icons/bi";
import { getCookie, getCookies, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { verifyToken } from "@/lib/db";
import { atom, useRecoilState } from "recoil";
import usePost from "@/lib/hooks/usePost";
import { redirect } from "next/dist/server/api-utils";
import gsap, { Elastic, Linear, Power0 } from "gsap";
import { SmallIconButton } from "@/components/Tailwind/Button/SmallIconButton";
import { User } from "@/interfaces/userDefinitions";
import { hashPassword } from "@/lib/utils";

type Credential = {
  username: string;
  password: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let token = getCookie("token", { req, res });
  let verified = await verifyToken(token?.toString());
  if (verified) {
    if (query.redirectTo) {
      return {
        redirect: {
          destination: decodeURIComponent(String(query.redirectTo)),
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default function Page() {
  const router = useRouter();

  const [credential, setCredential] = useState<Credential>({
    username: "",
    password: "",
  });

  const { error, data, loading, reload } = usePost<Credential, User>({
    url: "/auth/signIn",
    onComplete: (user) => {
      if (user) {
        router.reload();
      }
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative w-[450px] h-96">
        <div className="absolute h-96 p-8 rounded-xl shadow-xl border bg-white z-10 duration-300">
          <div className="w-96 flex items-center justify-end">
            {/* <Image width={100} height={30} src="/images/logo.png" alt="" /> */}
          </div>
          <div className="w-96 my-4">
            <p className="text-3xl text-center">IFindJob</p>
            <p className="w-full text-center text-xl my-4">
              Username/Password Login
            </p>
          </div>
          <div className="w-96 my-4">
            <TextField
              noDebounce={true}
              title="User Name"
              value={credential.username}
              onChangeF={(e) => {
                setCredential({
                  ...credential,
                  username: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-96 my-4">
            <TextField
              noDebounce={true}
              title="Password"
              inputType="password"
              value={credential.password}
              onChangeF={(e) => {
                setCredential({
                  ...credential,
                  password: e.target.value,
                });
              }}
              end={<AiOutlineEyeInvisible />}
            />
          </div>
          {error && (
            <div className="flex items-center justify-start w-96 my-4 text-red-500">
              <div className="p-2">
                <BiError />
              </div>
              {String(error)}
            </div>
          )}
          <div className="w-96 my-4 flex items-center justify-center">
            <SlideButton
              loading={loading}
              // disabled={true}
              text="Confirm"
              onClickF={async () => {
                reload({
                  username: credential.username,
                  password: hashPassword(credential.password),
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

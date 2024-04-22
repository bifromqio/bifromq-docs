import React from 'react';
import Typed from "typed.js";
import Translate, { translate as translateFn } from "@docusaurus/Translate";

import {
  UsersIcon,
  CloudArrowUpIcon,
  BoltIcon,
  ServerIcon,
} from '@heroicons/react/20/solid'

const textLines = [
  translateFn({ id: "High-Performance", message: "High-Performance" }),
  translateFn({ id: "Java-based", message: "Java-based" }),
  translateFn({ id: "Native Multi-Tenancy", message: "Native Multi-Tenancy" }),
  translateFn({ id: "Open-Sourced", message: "Open-Sourced" }),
  translateFn({ id: "Built-in Persistence", message: "Built-in Persistence" }),
  translateFn({ id: "Massive Connectivity", message: "Massive Connectivity" }),
  translateFn({ id: "Extensibility", message: "Extensibility" })
];

const primaryFeatures = [
  {
    name: <Translate>100% MQTT Support.</Translate>,
    description: <Translate>Fully supports MQTT 3.1, 3.1.1 and 5.0 features over TCP, TLS, WS, WSS.</Translate>,
    icon: CloudArrowUpIcon,
  },
  {
    name: <Translate>Built-in storage engine.</Translate>,
    description: <Translate>Optimized for critical load targeting, no third-party middleware dependencies.</Translate>,
    icon: ServerIcon,
  },
  {
    name: <Translate>Native Multi-Tenancy.</Translate>,
    description: <Translate>Built-in support for multi-tenancy resource sharing and workload isolation.</Translate>,
    icon: UsersIcon,
  },
  {
    name: <Translate>Extensible Mechanisms.</Translate>,
    description: <Translate>Supports extensions, including Authentication/Authorization, Event, and System/Tenant Monitoring.</Translate>,
    icon: BoltIcon,
  },
]

const stats = [
  {id: 1, name: <Translate>Connected Clients</Translate>, value: <Translate>180 Million+</Translate> },
  {id: 2, name: <Translate>Customers</Translate>, value: '6000+' },
]

export default function HeroSection() {
  const typedRef = React.useRef(null);
  React.useEffect(() => {
    const options = {
      strings: textLines,
      typeSpeed: 100,
      loop: true,
    };
    // Initialize Typed.js
    typedRef.current = new Typed('.typed-text', options);

    return () => {
      // Destroy Typed.js instance on unmounting
      typedRef.current.destroy();
    };
  }, []);

  return (
    <main>
      {/* Hero section */}
      <div className="overflow-hidden isolate">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>
        <div
          className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/532] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="py-32 sm:py-48">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="lg:text-6xl text-3xl pb-1.5 font-bold bg-gradient-to-r from-[#F303C8] via-[#03B6F1] to-[#03F7E7] text-transparent bg-clip-text leading-tight">
                <span>BifroMQ</span>
                <span className="text-gray-300"> ⚡️ </span>
                <br className='md:hidden block'/>
                <span className="typed-text"></span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                <b>BifroMQ </b><Translate>is a Java-based high-performance MQTT Broker messaging middleware that adopts Multi-tenancy architecture. Open-sourced by Baidu.</Translate>
              </p>
              {/* <div className="mt-6">
                <a href="https://iwenjuan.baidu.com/?code=kw9gi9" target="_blank" 
                   className="text-sm font-semibold leading-6 text-blue-600 dark:text-blue-300">
                <Translate>Join the waitlist</Translate>
                  <span aria-hidden="true">→</span>
                </a>
              </div> */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="https://github.com/bifromqio/bifromq" target='_blank' 
                  className="inline-flex items-center rounded-md dark:bg-white bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-gray-50 dark:text-gray-900 shadow-sm dark:hover:bg-gray-100 hover:bg-blue-600 hover:text-gray-50">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
                  <Translate>Go to GitHub</Translate> 
                </a>
                <a href="./docs/Readme/" className="text-sm font-semibold leading-6 dark:text-gray-50 text-blue-500">
                  <Translate>Get Started</Translate> <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="https://mp.weixin.qq.com/s/grq6KfOaCQSL-UW-qREfSg" target='_blank'>
                  <Translate>The race is on! OpenAtom Open Source Competition - BifroMQ Application Challenge is waiting for you!</Translate>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo cloud */}
      <div className="bg-gray-50 dark:bg-inherit py-12 sm:py-18">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8">
            <Translate>Trusted by the world’s most innovative teams</Translate>
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="./logocloud/baidu.png"
              alt="baidu"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="./logocloud/apollo.png"
              alt="apollo"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="./logocloud/hisense.png"
              alt="hisense"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="./logocloud/skyworth.png"
              alt="skyworth"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="./logocloud/chinaunicom.png"
              alt="chinaunicom"
              width={158}
              height={48}
            />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">
            <Translate>What is BifroMQ?</Translate>
          </p>
          <p className="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
            <Translate>BifroMQ is a high-performance, distributed MQTT broker implementation that seamlessly integrates native multi-tenancy support.</Translate>
            <Translate>It is designed to support building large-scale IoT device connections and messaging systems, Currently, it serves as the foundational technology for Baidu IoT Core, a public cloud serverless service.</Translate>
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 sm:grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
            {primaryFeatures.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold ">
                  <feature.icon className="absolute left-1 top-1 h-5 w-5 text-blue-500" aria-hidden="true" />
                  {feature.name}
                </dt>{' '}
                <dd className="inline">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* stats */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-5xl lg:mx-0 lg:max-w-5xl">
          <h2 className="text-base font-semibold leading-8 text-blue-500 dark:text-blue-300">
            <Translate>Our track record</Translate>
            </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">
            <Translate>Trusted by thousands of developers worldwide</Translate>
          </p>
          <p className="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-500">
            <Translate>Thanks to the operation of Baidu Intelligent Cloud (IoT Core), we have served thousands customers and a large number of device connections in the public cloud based on BifroMQ.</Translate>
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-y-3 border-l border-white/10">
              <dt className="text-sm leading-6">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-20 px-6 py-32 sm:mt-30 sm:py-40 lg:px-8">
        <svg
          className="absolute inset-0 -z-10 h-full w-full dark:stroke-white/10 stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1d4240dd-898f-445f-932d-e2872fd12de3"
              width={200}
              height={200}
              x="50%"
              y={0}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={0} className="overflow-visible fill-gray-100/20 dark:fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)" />
        </svg>
        <div
          className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/532] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
          <Translate>Boost your productivity.</Translate>
            <br />
            <Translate>Ready to get started ?</Translate>
          </h2>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="./docs/Readme/" 
              className="rounded-md dark:bg-white bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-gray-50 dark:text-gray-900 shadow-sm dark:hover:bg-gray-100 hover:bg-blue-600 hover:text-gray-50"
            >
            <Translate>Get started</Translate>
            </a>
            <a href="https://github.com/bifromqio/bifromq" className="dark:text-gray-50 text-sm font-semibold leading-6">
              <Translate>Go to GitHub</Translate>
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

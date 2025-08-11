"use client"
import { ShoppingCartIcon } from '@heroicons/react/16/solid'
import React from 'react'
import Image from 'next/image';
import {motion} from 'framer-motion'

import shoppingCart from '@/app/components/assets/onlineshopping-removebg-preview.png'


const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-white to-yellow-100 py-20 px-6 md:px-20 font-sans ">
      {/* Background Blobs */}
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-blue-200 rounded-full opacity-30 blur-3xl z-0"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-yellow-200 rounded-full opacity-30 blur-3xl z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          WELCOME TO <span className="text-blue-400">FLEXICA</span>
          </h1>
          <p className="mt-4 text-2xl text-blue-400 font-semibold justify-right">
            ONLINE STORE
          </p>
          <p className="text-xl text-gray-700 font-medium">
            "Your one-stop shop for everything you need."
          </p>
          <div className="flex justify-center md:justify-start gap-4">
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-6 py-3 rounded-md shadow-lg flex items-center justify-center gap-2 mx-auto md:mx-0 transition duration-300">
            shop with us
            <ShoppingCartIcon className="w-5 h-5 text-white" />
          </button>
          </div>
         
        </motion.div>

        {/* Image */}
        <motion.div
          className="flex justify-center md:justify-end ml-9"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={shoppingCart}
            alt="Shopping Cart"
            width={500}
            height={500}
            className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            priority
          />
        </motion.div>
      </div>
    </section>

  )
}

export default Hero
"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'

const HeroSection = () => {
    const imageRef=useRef(null)
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if (!imageElement) return;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
  return (
    <section  className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
                <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-bg gradient-title'>Your AI Carrer Coach for
                <br />
                Professional Success
                </h1>
                <p className='mx-auto max-w-[600px] text-muted-foregorund md:text-xl'>Advance your carrer with personalised guidance,interview prep, and AI-powered tools for job success</p>
            </div>
            <div className='flex space-x-4 justify-center'>
                <Link href='/dashboard'>
                <Button className='px-8' size='lg'>
                    Get Started
                </Button>
                </Link>
            </div>
            <div className='hero-image-wrapper mt-5 md:mt-0'>
                <div ref={imageRef} className='hero-image'>
                    <Image src={'/banner3.jpeg'}
                        width={1280}
                        height={720}
                        alt="Banner Preview"
                        className='rounded-lg shadow-2xl border mx-auto'
                        priority
                    />

                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
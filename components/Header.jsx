import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser'

 async function Header () {
  await checkUser()
  return (
     <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto md:px-15 h-16 flex items-center justify-between'>
        <Link href='/'>
      <div className="h-12 py-1 w-auto text-white font-bold text-2xl flex items-center">
  <span>CarrerGen</span>
  <span className="bg-gradient-to-r from-cyan-400 to-blue-700 text-transparent bg-clip-text">ie</span>
</div>

        </Link>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"}>
            <Button variant='outline' >
              <LayoutDashboard className='h-4 w-4' />
              <span className='hidden md:block'>Industry Insights</span>
            </Button>
            </Link>
         
          <DropdownMenu>
            
  <DropdownMenuTrigger asChild>
     <Button>
              <StarsIcon className='h-4 w-4' />
              <span className='hidden md:block'>Growth Tools</span>
              <ChevronDown className='h-4 w-4' />
            </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
 
    <DropdownMenuItem>
      <Link href={'/resume'} className='flex items-center gap-2' >
      <FileText className='h-4 w-4' />
      <span >Resume Builder</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem><Link href={'/ai-cover-letter'} className='flex items-center gap-2' >
      <PenBox className='h-4 w-4' />
      <span >Cover Letter</span>
      </Link></DropdownMenuItem>
    <DropdownMenuItem><Link href={'/interview'} className='flex items-center gap-2' >
      <GraduationCap className='h-4 w-4' />
      <span >Interview Prep</span>
      </Link></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
 </SignedIn>
        <SignedOut>
              <SignInButton>
                <Button variant='outline'>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{
                elements:{
                  avatarBox:"w-10 h-10",
                  userButtonPopoverCard:"Shadow-xl",
                  userPreviewMainIdentifier:"font-semibold"
                }
              }} 
              afterSignOutUrl='/'/>
            </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

const page = async () => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  return <div className='p-4'>
    <h1>Search notes</h1>
    <Link href={"/"} className='underline decoration-2 decoration-blue-400'>Home</Link>
  </div>
}

export default page

import minimist from 'minimist'
import settings from '@overleaf/settings'
import UserGetter from '../../../app/src/Features/User/UserGetter.mjs'
import OneTimeTokenHandler from '../../../app/src/Features/Security/OneTimeTokenHandler.mjs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)

export default async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['email'],
  })

  const { email } = argv
  if (!email) {
    console.error(`Usage: node ${filename} --email=joe@example.com`)
    process.exit(1)
  }

  try {
    const user = await UserGetter.promises.getUserByAnyEmail(email)

    if (!user) {
      console.error(`User with email ${email} not found.`)
      process.exit(1)
    }

    const data = { user_id: user._id.toString(), email: user.email }
    const token = await OneTimeTokenHandler.promises.getNewToken('password', data)

    const setNewPasswordUrl = `${settings.siteUrl}/user/password/set?passwordResetToken=${token}&email=${encodeURIComponent(user.email)}`

    console.log('')
    console.log(`Password reset URL for ${email}:`)
    console.log('')
    console.log(`  ${setNewPasswordUrl}`)
    console.log('')
    console.log('The user can visit this URL to set a new password.')
    console.log('')
  } catch (error) {
    console.error('Error generating password reset URL:', error)
    process.exit(1)
  }
}

if (filename === process.argv[1]) {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error({ error })
    process.exit(1)
  }
}


import { Suspense } from 'react'

import AdminArchivePurchasedButton from '@/components/admin/AdminArchivePurchasedButton'
import AdminExportButton from '@/components/admin/AdminExportButton'
import InviteUser from '@/components/admin/InviteUser'
import UserImpersonation from '@/components/admin/UserImpersonation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Admin() {
	// await new Promise(resolve => setTimeout(resolve, 50000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-2 animate-page-in">
			<div className="flex flex-col flex-1 gap-4">
				<h1>Admin</h1>
				<div className="flex flex-col gap-2">
					<Suspense>
						<UserImpersonation />
					</Suspense>
				</div>
				<div className="flex flex-col gap-2">
					<Suspense>
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 p-6 pt-0">
								<AdminArchivePurchasedButton />
								<AdminExportButton />
							</CardContent>
						</Card>
					</Suspense>
				</div>
				<div className="flex flex-col gap-2">
					<Suspense>
						<InviteUser />
					</Suspense>
				</div>

				<div className="flex flex-col gap-2">
					<Suspense>
						<Card>
							<CardHeader>
								<CardTitle>Env</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col p-6 pt-0 divide-y">
								{Object.entries(process.env)
									.filter(entry => !entry[0].startsWith('npm_'))
									.sort((a, b) => a[0].localeCompare(b[0]))
									.map(([key, value]) => (
										<div key={key} className="flex flex-col w-full py-1 overflow-hidden">
											<span className="font-mono text-xs font-bold text-gray-500">{key}</span>
											<span className="font-mono text-xs break-all">{String(value)}</span>
										</div>
									))}
							</CardContent>
						</Card>
					</Suspense>
				</div>
			</div>
		</div>
	)
}

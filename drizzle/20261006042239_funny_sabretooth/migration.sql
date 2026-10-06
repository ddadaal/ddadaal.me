CREATE TABLE `AdminLoginAttempts` (
	`Id` text PRIMARY KEY,
	`OccurredAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`IpHash` text NOT NULL,
	`Success` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `AdminLoginAttempts_Ip_Occurred` ON `AdminLoginAttempts` (`IpHash`,`OccurredAt`);--> statement-breakpoint
CREATE INDEX `AdminLoginAttempts_Occurred` ON `AdminLoginAttempts` (`OccurredAt`);--> statement-breakpoint
CREATE INDEX `VisitEvents_Occurred` ON `VisitEvents` (`OccurredAt`);
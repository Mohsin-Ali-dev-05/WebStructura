import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  SettingsPageShell,
  Toggle,
} from '../../components/ui/index.js';

export default function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <SettingsPageShell
      title="Security"
      description="Protect your account with a strong password and optional two-factor authentication."
    >
      <Card
        as="form"
        className="space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
        />

        <Input
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="At least 8 characters"
        />

        <Input
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter new password"
        />

        <Button type="submit" className="mt-2">
          Update password
        </Button>
      </Card>

      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 m-0">
            Two-factor authentication
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            Add an extra verification step when signing in from a new device.
          </p>
        </div>
        <Toggle
          checked={twoFactor}
          aria-label="Two-factor authentication"
          onChange={() => setTwoFactor((value) => !value)}
        />
      </Card>
    </SettingsPageShell>
  );
}
